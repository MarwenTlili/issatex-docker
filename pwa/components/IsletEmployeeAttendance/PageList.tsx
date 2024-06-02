import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "react-query"

import Pagination from "../common/Pagination"
import { EMPLOYEE_ATTENDANCE_ITEMS_PER_PAGE, List } from "./List"
import { PagedCollection } from "../../types/collection"
import { IsletEmployeeAttendance } from "../../types/IsletEmployeeAttendance"
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess"
import { useMercure } from "../../utils/mercure"
import Template from "../Template"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Session } from "next-auth"

export const getIsletEmployeeAttendancesPath = (
    page?: string | string[] | undefined,
    perPage?: string,
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `/api/islet_employee_attendances${pp}${p}`
}

export const getIsletEmployeeAttendances = (
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<IsletEmployeeAttendance>>(
            getIsletEmployeeAttendancesPath(page, perPage), {}, session
        )

const getPagePath = (path: string) =>
    `/islet-employee-attendances/page/${parsePage("api/islet_employee_attendances", path)}`

export const PageList: NextComponentType<NextPageContext> = () => {
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(EMPLOYEE_ATTENDANCE_ITEMS_PER_PAGE[1])

    const {
        query: { page },
    } = useRouter();

    const {
        data: { data: isletemployeeattendances, hubURL } = { hubURL: null },
    } = useQuery<FetchResponse<PagedCollection<IsletEmployeeAttendance>> | undefined>(
        getIsletEmployeeAttendancesPath(page, perPage),
        getIsletEmployeeAttendances(page, perPage, session)
    )

    const collection = useMercure(isletemployeeattendances, hubURL)

    if (!collection || !collection["hydra:member"]) return null

    return (
        <div>
            <div>
                <Head>
                    <title>IsletEmployeeAttendance List</title>
                </Head>
            </div>
            <Template>
                <List isletEmployeeAttendances={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                    session={session}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </div>
    )
}
