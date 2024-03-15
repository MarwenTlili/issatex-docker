import { DehydratedState } from "react-query";

import { PageList } from "../../components/employee/PageList";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

interface Data {
    props: {
        dehydratedState?: DehydratedState
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }

    if (!session) return data

    return data
}

export default PageList;
