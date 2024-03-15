import {
    NextComponentType,
    NextPageContext,
    GetServerSidePropsContext,
} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import { Show } from "../../../components/dailyProduction/Show"
import { DailyProduction } from "../../../types/DailyProduction"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import { useMercure } from "../../../utils/mercure"
import Template from "../../../components/Template"
import { getServerSession, Session } from "next-auth"
import { PagedCollection } from "../../../types/collection"
import { Size } from "../../../types/Size"
import { Choice } from "../../../types/Choice"
import { authOptions } from "../../api/auth/[...nextauth]"

const getDailyProduction = async (id: string | string[] | undefined) =>
    id
        ? await fetch<DailyProduction>(`/api/daily_productions/${id}`)
        : Promise.resolve(undefined)

const Page: NextComponentType<NextPageContext> = ({ sizes, choices }: ShowProductionProps) => {
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
                    <title>{`Show DailyProduction ${dailyproductionData.id}`}</title>
                </Head>
            </div>
            <Template>
                <Show dailyproduction={dailyproductionData} text={text}
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
    props: ShowProductionProps
}

interface ShowProductionProps {
    sizes?: Size[]
    choices?: Choice[]
}
