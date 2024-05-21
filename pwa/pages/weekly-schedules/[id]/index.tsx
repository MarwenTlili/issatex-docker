import {
    GetServerSidePropsContext,
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
import { getServerSession, Session } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]"
import { Size } from "../../../types/Size"
import { Choice } from "../../../types/Choice"
import { PagedCollection } from "../../../types/collection"

const getWeeklySchedule = async (id: string | string[] | undefined) =>
    id
        ? await fetch<WeeklySchedule>(`/api/weekly_schedules/${id}`)
        : Promise.resolve(undefined)

const Page: NextComponentType<NextPageContext> = ({ sizes, choices }: ShowScheduleProps) => {
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
                <Show weeklyschedule={weeklyscheduleData} text={text}
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
    props: ShowScheduleProps
}

interface ShowScheduleProps {
    sizes?: Size[]
    choices?: Choice[]
}