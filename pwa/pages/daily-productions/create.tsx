import { GetServerSidePropsContext, NextComponentType, NextPageContext } from "next"
import Head from "next/head"

import { Form } from "../../components/dailyProduction/Form"
import Template from "../../components/Template"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { FetchResponse, fetch } from "../../utils/dataAccess"
import { PagedCollection } from "../../types/collection"
import { WeeklySchedule } from "../../types/WeeklySchedule"
import { useMercure } from "../../utils/mercure"
import { DailyProduction } from "../../types/DailyProduction"
import { getDailyProductions, getDailyProductionsPath } from "../../components/dailyProduction/PageList"
import { Size } from "../../types/Size"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { Choice } from "../../types/Choice"

const Page: NextComponentType<NextPageContext> = ({ weeklySchedule, sizes, choices }: CreateDailyProductionProps) => {
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
                <Form dailyProductions={dailyProductions}
                    weeklySchedules={weeklySchedules}
                    weeklySchedule={weeklySchedule}
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

const getWeeklySchedules = (
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<WeeklySchedule>>(
            getWeeklySchedulesPath(page, perPage), {}, session
        )

const getWeeklySchedulesPath = (
    page?: string | string[] | undefined,
    perPage?: string
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `/api/weekly_schedules${pp}${p}`
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: DataProps = { props: {} }
    const weeklySchedule = (context.query.weeklySchedule as string | undefined)

    if (weeklySchedule) {
        data.props.weeklySchedule = weeklySchedule
    }

    if (!session) return data

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
    props: CreateDailyProductionProps
}

interface CreateDailyProductionProps {
    weeklySchedule?: string
    sizes?: Size[]
    choices?: Choice[]
}
