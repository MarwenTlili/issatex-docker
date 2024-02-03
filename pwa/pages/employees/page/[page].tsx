import { GetServerSidePropsContext } from "next";
import { DehydratedState } from "react-query";

import {
    PageList,
} from "../../../components/employee/PageList";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

interface Data {
    props: {
        dehydratedState?: DehydratedState
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }

    if (!session) return data

    if (session.user) {

    }

    return data
}

export default PageList;
