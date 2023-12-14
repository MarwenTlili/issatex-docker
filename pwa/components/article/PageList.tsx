import React, { FC, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "react-query"
import Pagination from "../common/Pagination"
import { ARTICLES_ITEMS_PER_PAGE, List } from "./List"
import { PagedCollection } from "../../types/collection"
import { Article } from "../../types/Article"
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess"
import { useMercure } from "../../utils/mercure"
import Template from "../Template"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { Client } from "../../types/Client"

export const getArticlesPath = (
    client: string,
    page?: string | string[] | undefined,
    perPage?: string,
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    // return `/api/articles${typeof page === "string" ? `?page=${page}` : ""}`
    return `${client}/articles${pp}${p}`
}

export const getArticles = (
    client: string,
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () => await
    fetch<PagedCollection<Article>>(
        getArticlesPath(client, page, perPage), {}, session
    )

const getPagePath = (path: string) =>
    `/articles/page/${parsePage("api/articles", path)}`

interface PageListProps {
    client: Client; // Replace with the actual type of client
}

export const PageList: FC<PageListProps> = (props) => {
    const { client } = props
    if (!client["@id"]) return null

    const { query: { page }, } = useRouter()
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(ARTICLES_ITEMS_PER_PAGE[1])

    const {
        data: { data: articles, hubURL } = { hubURL: null }
    } = useQuery<FetchResponse<PagedCollection<Article>> | undefined>(
        getArticlesPath(client["@id"], page, perPage,),
        getArticles(client["@id"], page, perPage, session)
    )

    const collection = useMercure(articles, hubURL)

    if (!collection || !collection["hydra:member"]) return null

    return (
        <>
            <Head>
                <title>Article List</title>
            </Head>
            <Template>
                <List articles={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </>
    )
}
