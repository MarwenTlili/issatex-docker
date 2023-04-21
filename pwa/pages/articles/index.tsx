import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
	PageList,
	getArticles,
	getArticlesPath,
} from "../../components/article/PageList";

export const getStaticProps: GetStaticProps = async () => {
	let token: string | undefined = undefined;

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(getArticlesPath(), getArticles(token));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
		revalidate: 1,
	};
};
export default PageList;
