import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { Form } from "../../../components/ManufacturingOrder/Form";
import { ManufacturingOrder } from "../../../types/ManufacturingOrder";
import { fetch } from "../../../utils/dataAccess";
import Template from "../../../components/Template";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { Client } from "../../../types/Client";
import { PagedCollection } from "../../../types/collection";
import { Article } from "../../../types/Article";
import { Size } from "../../../types/Size";
import { ManufacturingOrderSize } from "../../../types/ManufacturingOrderSize";
import { CreateManufacturingOrderProps } from "../create";

export interface EditManufacturingOrderProps extends CreateManufacturingOrderProps {
    manufacturingOrder?: ManufacturingOrder
    manufacturingOrderSizes?: ManufacturingOrderSize[]
}

interface Data {
    props: EditManufacturingOrderProps
}

const getClient = async (session: Session) =>
    await fetch<PagedCollection<Client>>(`/api/clients?account=${session.user.id}`, {}, session)

const getClientArticles = async (clientId: string | undefined, session: Session) =>
    clientId
        ? await fetch<PagedCollection<Article>>(`${clientId}/articles`, {}, session)
        : Promise.resolve(undefined)

const getArticleSizes = async (session: Session) =>
    await fetch<PagedCollection<Size>>(`/api/sizes`, {}, session)

const getManufacturingOrder = async (id: string | string[] | undefined, session: Session) =>
    id
        ? await fetch<ManufacturingOrder>(`/api/manufacturing_orders/${id}`, {}, session)
        : Promise.resolve(undefined);

const getManufacturingOrderSizes = async (id: string | string[] | undefined, session: Session) =>
    id
        ? await fetch<PagedCollection<ManufacturingOrderSize>>(`/api/manufacturing_orders/${id}/manufacturing_order_sizes`, {}, session)
        : Promise.resolve(undefined)

const Page: NextPage<EditManufacturingOrderProps> = ({ client, clientArticles, articleSizes, manufacturingOrder, manufacturingOrderSizes }) => {
    return (
        <div>
            <div>
                <Head>
                    <title>
                        {manufacturingOrder &&
                            `Edit Manufacturing Order`}
                    </title>
                </Head>
            </div>
            <Template>
                <Form
                    client={client}
                    articleSizes={articleSizes}
                    clientArticles={clientArticles}
                    manufacturingOrder={manufacturingOrder}
                    manufacturingOrderSizes={manufacturingOrderSizes}
                />
            </Template>
        </div>
    );
};

export default Page;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const id = context.params?.id

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

    const sizesFetchResponse = await getArticleSizes(session)
    data.props.articleSizes = sizesFetchResponse?.data["hydra:member"]

    if (client) {
        const clientArticlesFetchResponse = await getClientArticles(client["@id"], session)
        data.props.clientArticles = clientArticlesFetchResponse?.data
    }

    if (id) {
        const manufacturingOrderResponse = await getManufacturingOrder(id, session)
        data.props.manufacturingOrder = manufacturingOrderResponse?.data
        const manufacturingOrderSizesResponse = await getManufacturingOrderSizes(id, session)
        data.props.manufacturingOrderSizes = manufacturingOrderSizesResponse?.data["hydra:member"]
    }

    return data
}
