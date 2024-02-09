import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "react-query"

import Pagination from "../common/Pagination"
import { List, SCHEDULES_ITEMS_PER_PAGE } from "./List"
import { PagedCollection } from "../../types/collection"
import { WeeklySchedule } from "../../types/WeeklySchedule"
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess"
import { useMercure } from "../../utils/mercure"
import { useState } from "react"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import Template from "../Template"

export const getWeeklySchedulesPath = (
    page?: string | string[] | undefined,
    perPage?: string
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `/api/weekly_schedules${pp}${p}`
}

export const getWeeklySchedules = (
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<WeeklySchedule>>(
            getWeeklySchedulesPath(page, perPage), {}, session
        )

const getPagePath = (path: string) =>
    `/weekly-schedules/page/${parsePage("api/weekly_schedules", path)}`

export const PageList: NextComponentType<NextPageContext> = () => {
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(SCHEDULES_ITEMS_PER_PAGE[1])

    const {
        query: { page },
    } = useRouter()
    const { data: { data: weeklyschedules, hubURL } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<WeeklySchedule>> | undefined>(
            getWeeklySchedulesPath(page, perPage),
            getWeeklySchedules(page, perPage, session)
        )
    const collection = useMercure(weeklyschedules, hubURL)

    if (!collection || !collection["hydra:member"]) return null

    return (
        <div>
            <div>
                <Head>
                    <title>WeeklySchedule List</title>
                </Head>
            </div>
            <Template>
                <List weeklyschedules={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </div>
    )
}
