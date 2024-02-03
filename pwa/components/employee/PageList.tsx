import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { EMPLOYEES_ITEMS_PER_PAGE, List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Employee } from "../../types/Employee";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";
import { FC, useState } from "react";
import Template from "../Template";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export const getEmployeesPath = (
    page?: string | string[] | undefined,
    perPage?: string,
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `/api/employees${pp}${p}`
}

export const getEmployees = (
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<Employee>>(
            getEmployeesPath(page, perPage), {}, session
        );

const getPagePath = (path: string) =>
    `/employees/page/${parsePage("api/employees", path)}`;

export const PageList: FC<PageListProps> = (props) => {
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(EMPLOYEES_ITEMS_PER_PAGE[1])

    const {
        query: { page },
    } = useRouter();

    const {
        data: { data: employees, hubURL } = { hubURL: null }
    } = useQuery<FetchResponse<PagedCollection<Employee>> | undefined>(
        getEmployeesPath(page, perPage),
        getEmployees(page, perPage, session)
    );

    const collection = useMercure(employees, hubURL);

    if (!collection || !collection["hydra:member"]) return null;

    return (
        <div>
            <Head>
                <title>Employee List</title>
            </Head>
            <Template>
                <List employees={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                    session={session}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </div>
    );
};

interface PageListProps {

}