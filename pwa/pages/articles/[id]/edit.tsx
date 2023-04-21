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

import { Form } from "../../../components/article/Form";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import Template from "../../../components/Template";

const getArticle = async (id: string | string[] | undefined) =>
	id ? await fetch<Article>(`/api/articles/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
	const router = useRouter();
	const { id } = router.query;

	const { 
		data: { data: article } = {} 
	} = useQuery< FetchResponse<Article> | undefined >(
		["article", id], () => getArticle(id)
	);

	if (!article) {
		return <DefaultErrorPage statusCode={404} />;
	}

	return (
		<div>
			<div>
				<Head>
					<title>{article && `Edit Article ${article["designation"]}`}</title>
				</Head>
			</div>
			<Template>
				<Form article={article} />
			</Template>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async ({
	params: { id } = {},
}) => {
	if (!id) throw new Error("id not in query param");
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["article", id], () => getArticle(id));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const response = await fetch<PagedCollection<Article>>("/api/articles");
	const paths = await getItemPaths(
		response,
		"api/articles",
		"/articles/[id]/edit"
	);

	return {
		paths,
		fallback: true,
	};
};

export default Page;
