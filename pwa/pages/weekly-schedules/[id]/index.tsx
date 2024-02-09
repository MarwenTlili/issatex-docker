import {
    NextComponentType,
    NextPageContext,
} from "next"
import DefaultErrorPage from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import { Show } from "../../../components/WeeklySchedule/Show"
import { WeeklySchedule } from "../../../types/WeeklySchedule"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import { useMercure } from "../../../utils/mercure"
import Template from "../../../components/Template"

const getWeeklySchedule = async (id: string | string[] | undefined) =>
    id
        ? await fetch<WeeklySchedule>(`/api/weekly_schedules/${id}`)
        : Promise.resolve(undefined)

const Page: NextComponentType<NextPageContext> = () => {
    const router = useRouter()
    const { id } = router.query

    const {
        data: { data: weeklyschedule, hubURL, text } = { hubURL: null, text: "" },
    } = useQuery<FetchResponse<WeeklySchedule> | undefined>(
        ["weeklyschedule", id],
        () => getWeeklySchedule(id)
    )
    const weeklyscheduleData = useMercure(weeklyschedule, hubURL)

    if (!weeklyscheduleData) {
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{`Show WeeklySchedule ${weeklyscheduleData["@id"]}`}</title>
                </Head>
            </div>
            <Template>
                <Show weeklyschedule={weeklyscheduleData} text={text} />
            </Template>
        </div>
    )
}

export default Page
