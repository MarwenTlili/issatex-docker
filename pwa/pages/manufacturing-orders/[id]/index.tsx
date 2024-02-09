import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { Show } from "../../../components/ManufacturingOrder/Show"
import { ManufacturingOrder } from "../../../types/ManufacturingOrder"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import Template from "../../../components/Template"
import { Article } from "../../../types/Article"

const getManufacturingOrder = async (id: string | string[] | undefined) =>
    id
        ? await fetch<ManufacturingOrder>(`/api/manufacturing_orders/${id}`)
        : Promise.resolve(undefined)

const getArticle = async (id: string | string[] | undefined) =>
    id
        ? await fetch<Article>(`${id}`)
        : Promise.resolve(undefined)

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    const {
        data: { data: manufacturingOrder, hubURL, text } = {
            hubURL: null,
            text: "",
        },
    } = useQuery<FetchResponse<ManufacturingOrder> | undefined>(
        ["manufacturingOrder", id],
        () => getManufacturingOrder(id)
    )

    const {
        data: { data: article, hubURL: articleHubUrl, text: articleText } = {
            hubURL: null,
            text: "",
        },
    } = useQuery<FetchResponse<Article> | undefined>(
        ["article", manufacturingOrder?.article],
        () => getArticle(manufacturingOrder?.article as string)
    )
    
    if (!manufacturingOrder) {
        // return <DefaultErrorPage statusCode={404} />
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{`Show ManufacturingOrder ${manufacturingOrder?.["@id"]}`}</title>
                </Head>
            </div>
            <Template>
                <Show
                    manufacturingOrder={manufacturingOrder}
                    article={article}
                    text={text}
                />
            </Template>
        </div>
    )
}

export default Page
