import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
	PageList,
	getArticles,
	getArticlesPath,
} from "../../components/article/PageList";
import { getSession } from "next-auth/react";
// import { getSession, useSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async () => {
	/** read the session outside of the context of React. */
	// const session = await getSession();
	const session = await getSession();
	const token = session? session.user.tokens.token : "";

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(getArticlesPath(), getArticles(undefined, token));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
		revalidate: 1,
	};
};

export default PageList;
