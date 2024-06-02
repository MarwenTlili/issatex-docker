import { GetServerSidePropsContext, NextComponentType } from "next"
import Head from "next/head"

import { Form } from "../../components/IsletEmployeeAttendance/Form"
import Template from "../../components/Template"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { Employee } from "../../types/Employee"
import { Islet } from "../../types/Islet"
import { fetch } from "../../utils/dataAccess"
import { PagedCollection } from "../../types/collection"

const Page: NextComponentType<CreateIsletEmployeeAttendance> = (
    { employees, islets }: CreateIsletEmployeeAttendance
) => (
    <div>
        <div>
            <Head>
                <title>Create IsletEmployeeAttendance</title>
            </Head>
        </div>
        <Template>
            <Form employees={employees} islets={islets} />
        </Template>
    </div>
)

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
