import {
    GetServerSidePropsContext,
    NextComponentType,
} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import { Form } from "../../../components/dailyProduction/Form"
import { DailyProduction } from "../../../types/DailyProduction"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import Template from "../../../components/Template"
import { PagedCollection } from "../../../types/collection"
import { WeeklySchedule } from "../../../types/WeeklySchedule"
import { getWeeklySchedules, getWeeklySchedulesPath } from "../../../components/WeeklySchedule/PageList"
import { useMercure } from "../../../utils/mercure"
import { getDailyProductions, getDailyProductionsPath } from "../../../components/dailyProduction/PageList"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]"

const getDailyProduction = async (id: string | string[] | undefined, session: Session) =>
    id
        ? await fetch<DailyProduction>(`/api/daily_productions/${id}`, { headers: { Preload: `/ilot` } }, session)
        : Promise.resolve(undefined)

const Page: NextComponentType<EditDailyProductionProps> = ({ dailyProduction }: EditDailyProductionProps) => {
    const {
        query: { page },
    } = useRouter()
    const { data: { data: weeklyschedules, hubURL } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<WeeklySchedule>> | undefined>(
            getWeeklySchedulesPath(page),
            getWeeklySchedules(page)
        )
    const weeklySchedules = useMercure(weeklyschedules, hubURL)?.["hydra:member"]

    const { data: { data: productions, hubURL: productionsHub } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<DailyProduction>> | undefined>({
            queryKey: getDailyProductionsPath(page),
            queryFn: getDailyProductions(page),
            select: (data) => {

                return data
            }
        })
    const dailyProductions = useMercure(productions, productionsHub)?.["hydra:member"]

    if (!dailyProduction) {
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>
                        {dailyProduction &&
                            `Create DailyProduction ${dailyProduction["@id"]}`}
                    </title>
                </Head>
            </div>
            <Template>
                <Form dailyProduction={dailyProduction} weeklySchedules={weeklySchedules} dailyProductions={dailyProductions} />
            </Template>

        </div>
    )
}

export default Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: DataProps = { props: {} }
    const id = context.params?.id

    if (!session) {
        return data
    }

    const dailyProductionResponse = await getDailyProduction(id, session)
    if (dailyProductionResponse) {
        data.props.dailyProduction = dailyProductionResponse.data
        // transform data
        if (dailyProductionResponse?.data && dailyProductionResponse.data.ilot && typeof dailyProductionResponse.data.ilot !== 'string') {
            dailyProductionResponse.data.ilot = dailyProductionResponse.data.ilot["@id"]
        }
        if (dailyProductionResponse?.data && dailyProductionResponse.data.weeklySchedule && typeof dailyProductionResponse.data.weeklySchedule !== 'string') {
            dailyProductionResponse.data.weeklySchedule = dailyProductionResponse.data.weeklySchedule["@id"]
        }
    }

    return data
}

interface DataProps {
    props: EditDailyProductionProps
}

interface EditDailyProductionProps {
    dailyProduction?: DailyProduction
}
