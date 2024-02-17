import { NextComponentType, NextPageContext } from "next"
import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "react-query"

import Pagination from "../common/Pagination"
import { DAILYPRODUCTION_ITEMS_PER_PAGE, List } from "./List"
import { PagedCollection } from "../../types/collection"
import { DailyProduction } from "../../types/DailyProduction"
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess"
import { useMercure } from "../../utils/mercure"
import Template from "../Template"
import { Session } from "next-auth"
import { useState } from "react"
import { useSession } from "next-auth/react"

export const getDailyProductionsPath = (
    page?: string | string[] | undefined,
    perPage?: string
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `/api/daily_productions${pp}${p}`
}

export const getDailyProductions = (
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<DailyProduction>>(
            getDailyProductionsPath(page, perPage), {}, session
        )

const getPagePath = (path: string) =>
    `/daily-productions/page/${parsePage("api/daily_productions", path)}`

export const PageList: NextComponentType<NextPageContext> = () => {
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(DAILYPRODUCTION_ITEMS_PER_PAGE[1])

    const {
        query: { page },
    } = useRouter()

    const { data: { data: dailyproductions, hubURL } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<DailyProduction>> | undefined>(
            getDailyProductionsPath(page),
            getDailyProductions(page, perPage, session)
        )

    const collection = useMercure(dailyproductions, hubURL)

    if (!collection || !collection["hydra:member"]) return null
    
    return (
        <div>
            <div>
                <Head>
                    <title>DailyProduction List</title>
                </Head>
            </div>
            <Template>
                <List dailyproductions={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </div>
    )
}
