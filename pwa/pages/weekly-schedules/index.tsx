import { GetServerSidePropsContext } from "next"
import { DehydratedState } from "react-query"

import {
    PageList,
} from "../../components/WeeklySchedule/PageList"

interface Data {
    props: {
        dehydratedState?: DehydratedState
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const data: Data = { props: {} }

    return data
}

export default PageList
