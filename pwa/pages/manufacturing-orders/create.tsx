import Head from "next/head"
import { GetServerSidePropsContext, NextPage } from "next"
import { Form } from "../../components/ManufacturingOrder/Form"
import Template from "../../components/Template"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { fetch } from "../../utils/dataAccess"
import { PagedCollection } from "../../types/collection"
import { Size } from "../../types/Size"
import { Article } from "../../types/Article"
import { Client } from "../../types/Client"

const getClient = async (session: Session) =>
    await fetch<PagedCollection<Client>>(`/api/clients?account=${session.user.id}`, {}, session)

const getClientArticles = async (clientId: string | undefined, session: Session) =>
    await fetch<PagedCollection<Article>>(`${clientId}/articles`, {}, session)

const getArticleSizes = async (session: Session) =>
    await fetch<PagedCollection<Size>>(`/api/sizes`, {}, session)

export interface CreateManufacturingOrderProps {
    client?: Client
    clientArticles?: PagedCollection<Article>
    articleSizes?: Size[]
}

const Page: NextPage<CreateManufacturingOrderProps> = ({ client, clientArticles, articleSizes }) => {
    
    return (
        <div>
            <div>
                <Head>
                    <title>Create ManufacturingOrder</title>
                </Head>
            </div>
            <Template>
                <Form client={client} articleSizes={articleSizes} clientArticles={clientArticles} />
            </Template>
        </div>
    )
};

export default Page

interface Data {
    props: CreateManufacturingOrderProps
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)

    const data: Data = { props: {} }
    let client: Client | undefined = undefined

    if (!session) {
        return data
    }

    const clientFetchResponse = await getClient(session)
    if (clientFetchResponse && clientFetchResponse.data["hydra:member"]) {
        client = clientFetchResponse?.data["hydra:member"][0]
        data.props.client = clientFetchResponse?.data["hydra:member"][0]
    }

    const articleSizesFetchResponse = await getArticleSizes(session)
    data.props.articleSizes = articleSizesFetchResponse?.data["hydra:member"]

    if (client) {
        const clientArticlesFetchResponse = await getClientArticles(client["@id"], session)
        data.props.clientArticles = clientArticlesFetchResponse?.data
    }
    
    return data
}
