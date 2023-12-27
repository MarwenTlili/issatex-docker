import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "react-query"
import Pagination from "../common/Pagination"
import { List, ORDERS_ITEMS_PER_PAGE } from "./List"
import { PagedCollection } from "../../types/collection"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess"
import { useMercure } from "../../utils/mercure"
import Template from "../Template"
import { FC, useState } from "react"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { Client } from "../../types/Client"

export const getManufacturingOrdersPath = (
    client: string,
    page?: string | string[] | undefined,
    perPage?: string
) => {
    const pp = typeof perPage === "string" ? `?itemsPerPage=${perPage}` : ``
    const p = typeof page === "string" ? `&page=${page}` : ``
    return `${client}/manufacturing_orders${pp}${p}`
}

export const getManufacturingOrders = (
    client: string,
    page?: string | string[] | undefined,
    perPage?: string,
    session?: Session | null
) => async () =>
        await fetch<PagedCollection<ManufacturingOrder>>(
            getManufacturingOrdersPath(client, page, perPage), {}, session
        )

const getPagePath = (path: string) =>
    `/manufacturing-orders/page/${parsePage("api/manufacturing_orders", path)}`

interface PageListProps {
    client: Client; // Replace with the actual type of client
}
export const PageList: FC<PageListProps> = (props) => {
    const { client } = props
    if (!client["@id"]) return null

    const { query: { page }, } = useRouter()
    const { data: session, status } = useSession()
    const [perPage, setPerPage] = useState<string>(ORDERS_ITEMS_PER_PAGE[1])

    const { data: { data: manufacturingorders, hubURL } = { hubURL: null } } =
        useQuery<FetchResponse<PagedCollection<ManufacturingOrder>> | undefined>(
            getManufacturingOrdersPath(client["@id"], page, perPage),
            getManufacturingOrders(client["@id"], page, perPage, session)
        )

    const collection = useMercure(manufacturingorders, hubURL)

    if (!collection || !collection["hydra:member"]) return null

    return (
        <div>
            <div>
                <Head>
                    <title>ManufacturingOrder List</title>
                </Head>
            </div>
            <Template>
                <List manufacturingOrders={collection["hydra:member"]}
                    totalItems={collection["hydra:totalItems"]}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
                <Pagination collection={collection} getPagePath={getPagePath} />
            </Template>
        </div>
    )
}
