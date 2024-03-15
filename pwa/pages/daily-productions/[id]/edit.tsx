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
import { Size } from "../../../types/Size"
import { Choice } from "../../../types/Choice"

const getDailyProduction = async (id: string | string[] | undefined, session: Session) =>
    id
        ? await fetch<DailyProduction>(`/api/daily_productions/${id}`, {}, session)
        : Promise.resolve(undefined)

const Page: NextComponentType<EditDailyProductionProps> = ({ dailyProduction, sizes, choices }: EditDailyProductionProps) => {
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
                            `Edit DailyProduction ${dailyProduction.id}`}
                    </title>
                </Head>
            </div>
            <Template>
                <Form dailyProduction={dailyProduction}
                    weeklySchedules={weeklySchedules}
                    dailyProductions={dailyProductions}
                    sizes={sizes}
                    choices={choices}
                />
            </Template>

        </div>
    )
}

export default Page

const getSizes = async (session: Session) =>
    await fetch<PagedCollection<Size>>('/api/sizes', {}, session)

const getChoices = async (session: Session) =>
    await fetch<PagedCollection<Choice>>('/api/choices', {}, session)

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: DataProps = { props: {} }
    const id = context.params?.id

    if (!session) {
        return data
    }

    const dailyProductionResponse = await getDailyProduction(id, session)
    if (dailyProductionResponse) {
        const production = dailyProductionResponse.data
        data.props.dailyProduction = production;

        // transform data
        if (dailyProductionResponse?.data && dailyProductionResponse.data.weeklySchedule && typeof dailyProductionResponse.data.weeklySchedule !== 'string') {
            dailyProductionResponse.data.weeklySchedule = dailyProductionResponse.data.weeklySchedule["@id"]
        }
    }

    const sizesResponse = await getSizes(session)
    if (sizesResponse) {
        data.props.sizes = sizesResponse.data["hydra:member"]
    }

    const choicesResponse = await getChoices(session)
    if (choicesResponse) {
        data.props.choices = choicesResponse.data["hydra:member"]
    }

    return data
}

interface DataProps {
    props: EditDailyProductionProps
}

interface EditDailyProductionProps {
    dailyProduction?: DailyProduction
    sizes?: Size[]
    choices?: Choice[]
}
