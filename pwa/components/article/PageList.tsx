import React, { useState } from "react"
import { NextComponentType, NextPageContext } from "next"
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

export const getArticlesPath = (page?: string | string[] | undefined, perPage?: string) => {
    const pp = typeof perPage === "string" ? `?perPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
	// return `/api/articles${typeof page === "string" ? `?page=${page}` : ""}`
	return `/api/articles${pp}${p}`
}

export const getArticles = (
	page?: string | string[] | undefined,
    perPage?: string,
	session?: Session | null
) => async () =>
	await fetch<PagedCollection<Article>>(getArticlesPath(page), {}, session)

const getPagePath = (path: string) =>
	`/articles/page/${parsePage("api/articles", path)}`

const getClientArticles = async (id: string | undefined, session: Session) =>
    id ? fetch<PagedCollection<Article>>(`/api/clients/${id}/articles`, {}, session) : Promise.resolve(undefined)

type pageListProps = (
	NextComponentType<NextPageContext> | JSX.Element | null
) // & {auth: boolean}

export const PageList: pageListProps = ( props ) => {
	const { query: { page }, } = useRouter()
	const { data: session, status} = useSession()
    const [perPage, setPerPage] = useState<string>(ARTICLES_ITEMS_PER_PAGE[1])
    
	const {
		data: { data: articles, hubURL } = { hubURL: null }
	} = useQuery<FetchResponse<PagedCollection<Article>> | undefined>(
		getArticlesPath(page), getArticles(page, perPage, session)
	)

	const collection = useMercure(articles, hubURL)

	if (!collection || !collection["hydra:member"]) return null
    
	return (
		<>
			<Head>
				<title>Article List</title>
			</Head>
			<Template>
				<List 
                    articles={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
				<Pagination collection={collection} getPagePath={getPagePath} />
			</Template>
		</>
	)
}
