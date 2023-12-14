import { GetServerSidePropsContext } from "next"
import { DehydratedState } from "react-query"

import {
	PageList,
} from "../../../components/article/PageList"
import { PagedCollection } from "../../../types/collection"

import { fetch } from "../../../utils/dataAccess"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]"
import { Client } from "../../../types/Client"

export const getClient = async (id: string | undefined, session: Session) =>
    id ? fetch<PagedCollection<Client>>(`/api/clients?account=${id}`, {}, session) : Promise.resolve(undefined)

interface Data {
    props: {
        dehydratedState?: DehydratedState
        client?: Client
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }
    
    if (!session) return data

    if (session.user) {
        const client = await getClient(session.user.id, session)
        if (client?.data["hydra:member"]) {
            const [first] = client.data["hydra:member"]
            data.props.client = first
        }
    }

	return data
}

export default PageList
