import {
    NextComponentType,
    NextPageContext,
} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import { Show } from "../../../components/dailyProduction/Show"
import { DailyProduction } from "../../../types/DailyProduction"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import { useMercure } from "../../../utils/mercure"
import Template from "../../../components/Template"

const getDailyProduction = async (id: string | string[] | undefined) =>
    id
        ? await fetch<DailyProduction>(`/api/daily_productions/${id}`)
        : Promise.resolve(undefined)

const Page: NextComponentType<NextPageContext> = () => {
    const router = useRouter()
    const { id } = router.query

    const {
        data: { data: dailyproduction, hubURL, text } = { hubURL: null, text: "" },
    } = useQuery<FetchResponse<DailyProduction> | undefined>(
        ["dailyproduction", id],
        () => getDailyProduction(id)
    )
    const dailyproductionData = useMercure(dailyproduction, hubURL)

    if (!dailyproductionData) {
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{`Show DailyProduction ${dailyproductionData["@id"]}`}</title>
                </Head>
            </div>
            <Template>
                <Show dailyproduction={dailyproductionData} text={text} />
            </Template>
        </div>
    )
}

export default Page
