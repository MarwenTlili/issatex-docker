import { dehydrate, QueryClient } from "react-query";

import {
	PageList,
	getArticles,
	getArticlesPath,
} from "../../components/article/PageList";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let session = await getServerSession(context.req, context.res, authOptions);
	// console.log("session: ", session);

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(getArticlesPath(), getArticles(undefined, session));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			user: session?.user
		},
	};
};

export default PageList;
