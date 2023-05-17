import { GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
	PageList,
	getArticles,
	getArticlesPath,
} from "../../../components/article/PageList";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";

import { fetch, getCollectionPaths } from "../../../utils/dataAccess";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let session = await getServerSession(context.req, context.res, authOptions);
	const params = context.params;
	const page = params?.page
	// console.log("session: ", session);


	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(getArticlesPath(), getArticles(page, session));

	const response = await fetch<PagedCollection<Article>>("/api/articles", {}, session);
	const paths = await getCollectionPaths(
		response,
		"api/articles",
		"/articles/page/[page]"
	);

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			paths
		},
	};
};

export default PageList;
