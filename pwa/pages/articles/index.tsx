import { dehydrate, DehydratedState, QueryClient } from "react-query"

import {
    PageList,
    getArticles,
    getArticlesPath,
} from "../../components/article/PageList"

import { getServerSession, Session } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { GetServerSidePropsContext } from "next"
import { fetch } from "../../utils/dataAccess"
import { PagedCollection } from "../../types/collection"
import { Article } from "../../types/Article"
import { Client } from "../../types/Client"
import { User } from "../../types/User"

const getClient = async (id: string | undefined, session: Session) =>
    id ? fetch<PagedCollection<Client>>(`/api/clients?account=${id}`, {}, session) : Promise.resolve(undefined)

interface Data {
    props: {
        dehydratedState?: DehydratedState
        user?: User
        client?: Client
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }

    // const queryClient = new QueryClient()
    // await queryClient.prefetchQuery(getArticlesPath(), getArticles(undefined, session))

    if (!session) return data

    // data.props.dehydratedState = dehydrate(queryClient)

    if (session.user) {
        data.props.user = session.user
        const client = await getClient(session.user.id, session)
        if (client?.data["hydra:member"]) {
            const [first] = client.data["hydra:member"]
            data.props.client = first
        }
    }

    return data
}

export default PageList
