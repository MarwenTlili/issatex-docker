import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
	PageList,
	getArticles,
	getArticlesPath,
} from "../../../components/article/PageList";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, getCollectionPaths } from "../../../utils/clientDataAccess";
import { getSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async ({
	params: { page } = {},
}) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(getArticlesPath(page), getArticles(page));

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

	const response = await fetch<PagedCollection<Article>>("/api/articles", {}, token);
	const paths = await getCollectionPaths(
		response,
		"api/articles",
		"/articles/page/[page]"
	);

	return {
		paths,
		fallback: true,
	};
};

export default PageList;
