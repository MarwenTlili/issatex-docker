import { FunctionComponent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"

import ReferenceLinks from "../common/ReferenceLinks"
import { fetch, getItemPath } from "../../utils/dataAccess"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import { Article } from "../../types/Article"
import useSWR from "swr"
import { TechnicalDocument } from "../../types/TechnicalDocument"
import { ManufacturingOrderSize } from "../../types/ManufacturingOrderSize"
import { Size } from "../../types/Size"
import { useSession } from "next-auth/react"

/**
 * TechnicalDocument Component
 */
const technicalDocumentFetcher = (id: string | undefined) =>
    id ? fetch<TechnicalDocument>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)

const TechnicalDocumentElement = ({ id }: { id: string }) => {
    const { data: technicalDocument, } = useSWR(id, technicalDocumentFetcher)
    if (!technicalDocument?.contentUrl) return <span>...</span>

    const filePath = technicalDocument.contentUrl;
    const fileName = filePath ? filePath.match(/\/([^\/]+)$/)?.[1] : "";

    if (!fileName) return <span>...</span>

    return (
        <Link
            href={`${technicalDocument.contentUrl}`}
            target="_blank"
        >
            {fileName}
        </Link>
    )
}

/**
 * ManufacturingOrderSize Component
 */
const manufacturingOrderSizeFetcher = (id: string | undefined) =>
    id ? fetch<ManufacturingOrderSize>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)

const ManufacturingOrderSizeElement = ({ id }: { id: string }) => {
    const { data: manufacturingOrderSize, error, isLoading } = useSWR(id, manufacturingOrderSizeFetcher)
    if (error) return <span>...</span>

    if (error || isLoading || !manufacturingOrderSize?.["@id"]
        || !manufacturingOrderSize.size
    ) return <span>...</span>

    return (
        <div>
            <SizeElement id={manufacturingOrderSize.size} />
            {` ${manufacturingOrderSize.quantity} `}
        </div>
    )
}

/**
 * Size Component
 */
const sizeFetcher = (id: string | undefined) =>
    id ? fetch<Size>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)

const SizeElement = ({ id }: { id: string | undefined }) => {
    const { data: size, error, isLoading } = useSWR(id, sizeFetcher)

    if (error || isLoading || !size?.["@id"]) return <span>...</span>

    return (
        <span>{size.name}</span>
    )

}

interface Props {
    manufacturingOrder: ManufacturingOrder
    text: string
    article?: Article
}

export const Show: FunctionComponent<Props> = ({ manufacturingOrder, article, text }) => {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { data: session } = useSession()

    const handleDelete = async () => {
        if (!manufacturingOrder["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return

        try {
            await fetch(manufacturingOrder["@id"], { method: "DELETE" })
            router.push("/manufacturing-orders")
        } catch (error) {
            setError("Error when deleting the resource.")
            console.error(error)
        }
    }

    const DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        timeZone: 'UTC'
    }

    return (
        <div className="p-4">
            <Head>
                <title>{`Show ManufacturingOrder ${manufacturingOrder["@id"]}`}</title>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </Head>
            {session?.user.roles.includes("ROLE_CLIENT") && (
                <Link
                    href="/manufacturing-orders"
                    className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
                >
                    {"< Back to list"}
                </Link>
            )}
            <div className="text-2xl mb-2 block md:flex">
                <p>
                    <strong>Article:</strong> {article?.model}
                </p>
            </div>
            <table cellPadding={10}
                className="shadow-md table table-auto border-collapse min-w-full leading-normal text-left my-3"
            >
                <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200">
                    <tr>
                        <th scope="row">createdAt</th>
                        <td>
                            {
                                manufacturingOrder.createdAt
                                    ? new Intl.DateTimeFormat('en-US', DATE_TIME_FORMAT_OPTIONS).format(
                                        new Date(manufacturingOrder.createdAt)
                                    )
                                    : ''
                            }
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">article</th>
                        <td>
                            {manufacturingOrder["article"] && (
                                <Link
                                    href={getItemPath(manufacturingOrder.article as string, "/articles/[id]")}
                                    target="_blank"
                                    className="font-bold"
                                >
                                    {article?.designation}
                                </Link>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Technical Doc</th>
                        <td>
                            {manufacturingOrder.technicalDocument && (<TechnicalDocumentElement id={manufacturingOrder.technicalDocument} />)}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">unitTime</th>
                        <td>{manufacturingOrder["unitTime"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">unitPrice</th>
                        <td>{manufacturingOrder["unitPrice"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">totalQuantity</th>
                        <td>{manufacturingOrder["totalQuantity"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">totalPrice</th>
                        <td>{manufacturingOrder["totalPrice"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">observation</th>
                        <td>
                            <div className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: manufacturingOrder["observation"] ?? "" }}
                            ></div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">urgent</th>
                        <td>
                            {manufacturingOrder.urgent
                                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">launched</th>
                        <td>
                            {manufacturingOrder.launched
                                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">denied</th>
                        <td>
                            {manufacturingOrder.denied
                                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">Sizes</th>
                        <td>
                            {manufacturingOrder.manufacturingOrderSizes && (
                                manufacturingOrder.manufacturingOrderSizes.map(orderSize => {
                                    return <ManufacturingOrderSizeElement id={orderSize as string} key={orderSize as string} />
                                })
                            )}
                        </td>
                    </tr>

                    {/* <tr>
                        <th scope="row">weeklySchedule</th>
                        <td>
                            <Link
                                href={getItemPath(
                                    manufacturingOrder.weeklySchedule,
                                    "/manufacturingorders/[id]/edit"
                                )}
                            >
                                {manufacturingOrder.weeklySchedule}
                            </Link>
                        </td>
                    </tr> */}
                    {/* <tr>
                        <th scope="row">palettes</th>
                        <td>
                            {manufacturingOrder["palettes"] && (

                                <ReferenceLinks
                                    items={manufacturingOrder["palettes"].map((ref: any) => ({
                                        href: getItemPath(ref, "/palettes/[id]"),
                                        name: ref,
                                    }))}
                                />
                            )}
                        </td>
                    </tr> */}
                    {/* <tr>
                        <th scope="row">invoice</th>
                        <td>
                            {manufacturingOrder["invoice"] && (
                                <ReferenceLinks
                                    items={{
                                        href: getItemPath(
                                            manufacturingOrder["invoice"],
                                            "/invoices/[id]"
                                        ),
                                        name: manufacturingOrder["invoice"],
                                    }}
                                />
                            )}
                        </td>
                    </tr> */}
                </tbody>
            </table>
            {error && (
                <div
                    className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {session?.user.roles.includes("ROLE_CLIENT") && (
                <div className="flex space-x-2 mt-4 items-center justify-end">
                    <Link
                        href={getItemPath(
                            manufacturingOrder["@id"],
                            "/manufacturing-orders/[id]/edit"
                        )}
                        className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}
