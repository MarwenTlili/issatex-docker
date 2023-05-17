import React from "react";
import { GetServerSidePropsContext, NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { QueryClient, dehydrate, useQuery } from "react-query";
import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Article } from "../../types/Article";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";
import Template from "../Template";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export const getArticlesPath = (page?: string | string[] | undefined) =>
	`/api/articles${typeof page === "string" ? `?page=${page}` : ""}`;

export const getArticles = (
	page?: string | string[] | undefined,
	session?: Session | null
) => async () =>
	await fetch<PagedCollection<Article>>(getArticlesPath(page), {}, session);

const getPagePath = (path: string) =>
	`/articles/page/${parsePage("api/articles", path)}`;

type pageListProps = (
	NextComponentType<NextPageContext> | JSX.Element | null
) // & {auth: boolean}

export const PageList: pageListProps = ( props ) => {
	// console.log("props: ", props);	// dehydratedState, user

	const { query: { page }, } = useRouter();
	const { data: session, status} = useSession();
	// console.log("session: ", session);

	const {
		data: { data: articles, hubURL } = { hubURL: null }
	} = useQuery<FetchResponse<PagedCollection<Article>> | undefined>(
		getArticlesPath(page), getArticles(page)
	);

	const collection = useMercure(articles, hubURL);

	if (!collection || !collection["hydra:member"]) return null;

	return (
		<>
			<Head>
				<title>Article List</title>
			</Head>
			<Template>
				<List articles={collection["hydra:member"]} />
				<Pagination collection={collection} getPagePath={getPagePath} />
			</Template>
		</>
	);
};
