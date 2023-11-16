import { GetServerSidePropsContext, NextComponentType } from "next";
import Head from "next/head";
import { Form } from "../../components/article/Form";
import Template from "../../components/Template";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { Client } from "../../types/Client";
import { fetch } from "../../utils/dataAccess";
import { PagedCollection } from "../../types/collection";

const getClient = async (session: Session) =>
    await fetch<PagedCollection<Client>>(`/api/clients?account=${session.user.id}`, {}, session)

export interface CreateArticleProps {
    client?: Client
}

const Page: NextComponentType<CreateArticleProps> = ({ client }: CreateArticleProps) => {
    return (
        <div>
            <div>
                <Head>
                    <title>Create Article</title>
                </Head>
            </div>

            <Template>
                <Form client={client} />
            </Template>
        </div>
    )
};

export default Page;

interface Data {
    props: CreateArticleProps
}

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
