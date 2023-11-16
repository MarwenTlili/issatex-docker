import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Form } from "../../../components/article/Form";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { fetch, FetchResponse } from "../../../utils/dataAccess";
import Template from "../../../components/Template";
import { Client } from "../../../types/Client";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { CreateArticleProps } from "../create";

export interface EditArticleProps extends CreateArticleProps {
    
}

interface Data {
    props: EditArticleProps
}

const getClient = async (session: Session) =>
    await fetch<PagedCollection<Client>>(`/api/clients?account=${session.user.id}`, {}, session)

const getArticle = async (id: string | string[] | undefined) =>
	id ? await fetch<Article>(`/api/articles/${id}`) : Promise.resolve(undefined);

const Page: NextPage<EditArticleProps> = ({ client }) => {
	const router = useRouter();
	const { id } = router.query;

	const { 
		data: { data: article } = {} 
	} = useQuery< FetchResponse<Article> | undefined >(
		["article", id], () => getArticle(id)
	);

	if (!article) {
		return <>loading ...</>
		// return <DefaultErrorPage statusCode={404} />;
	}

	return (
		<div>
			<div>
				<Head>
					<title>{article && `Edit Article ${article["designation"]}`}</title>
				</Head>
			</div>
			<Template>
				<Form article={article} client={client}/>
			</Template>
		</div>
	);
};

export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }

    if (!session) {
        return data
    }

    const clientFetchResponse = await getClient(session)
    if (clientFetchResponse && clientFetchResponse.data["hydra:member"]) {
        data.props.client = clientFetchResponse.data["hydra:member"][0]
    }

    return data
}
