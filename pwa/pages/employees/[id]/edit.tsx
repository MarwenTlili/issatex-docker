import {
    NextComponentType,
    NextPageContext,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Form } from "../../../components/employee/Form";
import { Employee } from "../../../types/Employee";
import { fetch, FetchResponse } from "../../../utils/dataAccess";
import Template from "../../../components/Template";

const getEmployee = async (id: string | string[] | undefined) =>
    id
        ? await fetch<Employee>(`/api/employees/${id}`)
        : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: { data: employee } = {} } = useQuery<
        FetchResponse<Employee> | undefined
    >(["employee", id], () => getEmployee(id));

    if (!employee) {
        return <>loading ...</>;
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{employee && `Edit Employee ${employee["@id"]}`}</title>
                </Head>
            </div>

            <Template>
                <Form employee={employee} />
            </Template>
        </div>
    );
};

export default Page;
