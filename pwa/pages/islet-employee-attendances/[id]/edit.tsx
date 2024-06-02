import {
    GetServerSidePropsContext,
    NextComponentType,
    NextPageContext,
} from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import { Form } from "../../../components/IsletEmployeeAttendance/Form"
import { IsletEmployeeAttendance } from "../../../types/IsletEmployeeAttendance"
import { fetch, FetchResponse } from "../../../utils/dataAccess"
import Template from "../../../components/Template"
import { getServerSession, Session } from "next-auth"
import { Employee } from "../../../types/Employee"
import { PagedCollection } from "../../../types/collection"
import { Islet } from "../../../types/Islet"
import { authOptions } from "../../api/auth/[...nextauth]"

const getIsletEmployeeAttendance = async (id: string | string[] | undefined) =>
    id
        ? await fetch<IsletEmployeeAttendance>(
            `/api/islet_employee_attendances/${id}`
        )
        : Promise.resolve(undefined)

const Page: NextComponentType<NextPageContext> = (
    { employees, islets }: CreateIsletEmployeeAttendance
) => {
    const router = useRouter()
    const { id } = router.query

    const { data: { data: isletEmployeeAttendance } = {} } = useQuery<
        FetchResponse<IsletEmployeeAttendance> | undefined
    >(["isletEmployeeAttendance", id], () => getIsletEmployeeAttendance(id))

    if (!isletEmployeeAttendance) {
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>
                        {isletEmployeeAttendance &&
                            `Edit IsletEmployeeAttendance ${isletEmployeeAttendance["@id"]}`}
                    </title>
                </Head>
            </div>
            <Template>
                <Form isletEmployeeAttendance={isletEmployeeAttendance}
                    employees={employees} islets={islets} />
            </Template>
        </div>
    )
}

export default Page

const getEmployees = async (session: Session) =>
    await fetch<PagedCollection<Employee>>(`/api/employees`, {}, session)

const getIslets = async (session: Session) =>
    await fetch<PagedCollection<Islet>>(`/api/islets`, {}, session)

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    const data: Data = { props: {} }

    if (!session) {
        return data
    }

    const employeesFetchResponse = await getEmployees(session)
    if (employeesFetchResponse && employeesFetchResponse.data["hydra:member"]) {
        data.props.employees = employeesFetchResponse.data["hydra:member"]
    }

    const isletsFetchResponse = await getIslets(session)
    if (isletsFetchResponse && isletsFetchResponse.data["hydra:member"]) {
        data.props.islets = isletsFetchResponse.data["hydra:member"]
    }

    return data
}

export interface CreateIsletEmployeeAttendance {
    employees?: Employee[]
    islets?: Islet[]
}

interface Data {
    props: CreateIsletEmployeeAttendance
}
