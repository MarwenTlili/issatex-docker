import {
	GetStaticPaths,
	GetStaticProps,
	NextComponentType,
	NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/article/Show";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/clientDataAccess";
import { useMercure } from "../../../utils/mercure";
import { getSession } from "next-auth/react";

const getArticle = async (
	id: string | string[] | undefined,
	token: string | undefined
)  => id ? await fetch<Article>(`/api/articles/${id}`, {}, token) : Promise.resolve(undefined);

// const Page: NextComponentType<NextPageContext> & {auth: boolean} = async () => {
const Page = async () => {
	const router = useRouter();
	const { id } = router.query;
	const session = await getSession();
	const token = session? session.user.tokens.token : "";

	const { 
		data: { data: article, hubURL, text } = { hubURL: null, text: "" } 
	} = useQuery<FetchResponse<Article> | undefined>(
		["article", id], () => getArticle(id, token)
	);
	const articleData = useMercure(article, hubURL);

	if (!articleData) {
		return <DefaultErrorPage statusCode={404} />;
	}

	return (
		<div>
			<div>
				<Head>
					<title>{`Show Article ${articleData["@id"]}`}</title>
				</Head>
			</div>
			<Show article={articleData} text={text} token={token}/>
		</div>
	);
};
Page.auth = true;

export const getStaticProps: GetStaticProps = async ({
	params: { id } = {},
}) => {
	const session = await getSession();
	const token = session? session.user.tokens.token : "";
	
	if (!id) throw new Error("id not in query param");
	const queryClient = new QueryClient();
	try {
		await queryClient.prefetchQuery(["article", id], () => getArticle(id, token));
	} catch (error) {
		console.error(error);
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const session = await getSession();
	const token = session? session.user.tokens.token : "";

	const response = await fetch<PagedCollection<Article>>(
		"/api/articles", {}, 
		token
	);
	const paths = await getItemPaths(response, "api/articles", "/articles/[id]", token);

	return {
		paths,
		fallback: true
	};
};

export default Page;
