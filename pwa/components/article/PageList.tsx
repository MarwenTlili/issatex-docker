import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Article } from "../../types/Article";
import { fetch, FetchResponse, parsePage } from "../../utils/clientDataAccess";
import { useMercure } from "../../utils/mercure";
import Template from "../Template";
import { useSession } from "next-auth/react";

export const getArticlesPath = (page?: string | string[] | undefined) =>
	`/api/articles${typeof page === "string" ? `?page=${page}` : ""}`;

export const getArticles = (
	page?: string | string[] | undefined, 
	token?: string | undefined
) => async () => 
	await fetch<PagedCollection<Article>>(getArticlesPath(page), {}, token);

const getPagePath = (path: string) =>
	`/articles/page/${parsePage("api/articles", path)}`;

export const PageList: (
	NextComponentType<NextPageContext> | JSX.Element | null
) & {auth: boolean} = () => {
	const { data: session, status } = useSession();
	// console.log("session: ", session);
	const token = session?.user.tokens.token;

	const { query: { page }, } = useRouter();

	const { 
		data: { data: articles, hubURL } = { hubURL: null } 
	} = useQuery<FetchResponse<PagedCollection<Article>> | undefined>(
		getArticlesPath(page), getArticles(page, token)
	);
	
	const collection = useMercure(articles, hubURL);

	if (!collection || !collection["hydra:member"]) return null;

	return (
		<div>
			<div>
				<Head>
					<title>Article List</title>
				</Head>
			</div>
			<Template>
				<List articles={collection["hydra:member"]} />
				<Pagination collection={collection} getPagePath={getPagePath} />
			</Template>
		</div>
	);
};
PageList.auth = true;
