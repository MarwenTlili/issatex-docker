import { NextComponentType, NextPageContext } from "next"
import Head from "next/head"

import { Form } from "../../components/dailyProduction/Form"
import Template from "../../components/Template"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { getWeeklySchedules, getWeeklySchedulesPath } from "../../components/WeeklySchedule/PageList"
import { FetchResponse } from "../../utils/dataAccess"
import { PagedCollection } from "../../types/collection"
import { WeeklySchedule } from "../../types/WeeklySchedule"
import { useMercure } from "../../utils/mercure"
import { DailyProduction } from "../../types/DailyProduction"
import { getDailyProductions, getDailyProductionsPath } from "../../components/dailyProduction/PageList"

const Page: NextComponentType<NextPageContext> = () => {
    const {
        query: { page },
    } = useRouter()
    const { data: { data: schedules, hubURL: schedulesHub } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<WeeklySchedule>> | undefined>({
            queryKey: getWeeklySchedulesPath(page),
            queryFn: getWeeklySchedules(page)
        })
    const weeklySchedules = useMercure(schedules, schedulesHub)?.["hydra:member"]

    const { data: { data: productions, hubURL: productionsHub } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<DailyProduction>> | undefined>({
            queryKey: getDailyProductionsPath(page),
            queryFn: getDailyProductions(page)
        })
    const dailyProductions = useMercure(productions, productionsHub)?.["hydra:member"]

    return (
        <div>
            <div>
                <Head>
                    <title>Create Daily Production</title>
                </Head>
            </div>
            <Template>
                <Form weeklySchedules={weeklySchedules} dailyProductions={dailyProductions} />
            </Template>
        </div>
    )
}

export default Page
