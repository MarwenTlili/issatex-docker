import {
    NextComponentType,
    NextPageContext,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Show } from "../../../components/employee/Show";
import { Employee } from "../../../types/Employee";
import { fetch, FetchResponse } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";
import { useSession } from "next-auth/react";
import Template from "../../../components/Template";

const getEmployee = async (id: string | string[] | undefined) =>
    id
        ? await fetch<Employee>(`/api/employees/${id}`)
        : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
    const { data: session, status } = useSession()
    const router = useRouter();
    const { id } = router.query;

    const {
        data: { data: employee, hubURL, text } = { hubURL: null, text: "" },
    } = useQuery<FetchResponse<Employee> | undefined>(["employee", id], () =>
        getEmployee(id)
    );
    const employeeData = useMercure(employee, hubURL);

    if (!employeeData) {
        return <>loading ...</>;
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{`Show Employee ${employeeData["@id"]}`}</title>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </Head>
            </div>
            <Template>
                <Show employee={employeeData} text={text} session={session} />
            </Template>
        </div>
    );
};

export default Page;
