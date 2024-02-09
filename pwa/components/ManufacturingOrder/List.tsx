import { Dispatch, FunctionComponent, SetStateAction } from "react"
import Link from "next/link"
import { FetchError, FetchResponse, fetch, getItemPath } from "../../utils/dataAccess"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import { Article } from "../../types/Article"
import useSWR from 'swr'
import { useMutation } from "react-query"

export const ORDERS_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

const fetcher = (id: string | undefined) =>
    id ? fetch<Article>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)

const ArticleElement = ({ id }: { id: string | undefined }) => {
    const { data: article, } = useSWR(id, fetcher)

    if (!article) return <div><strong>Article:</strong> ...</div>

    return (
        <div className="flex">
            <strong>Article:</strong>
            <Link
                href={getItemPath(
                    article["@id"],
                    "/articles/[id]"
                )}
                className="line-clamp-2"
            >
                {article.designation}
            </Link>
        </div>
    )
}

interface Props {
    manufacturingOrders: ManufacturingOrder[]
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
}

interface DeleteProps {
    id: string
}

const deleteManufacturingOrder = async (id: string) =>
    await fetch<ManufacturingOrder>(id, { method: "DELETE" })

export const List: FunctionComponent<Props> = ({ manufacturingOrders, totalItems, perPage, setPerPage }) => {
    const deleteManufacturingOrderMutation = useMutation<
        FetchResponse<ManufacturingOrder> | undefined,
        Error | FetchError,
        DeleteProps
    >(({ id }) => deleteManufacturingOrder(id), {
        onSuccess: () => {
            // router.push("/manufacturing-orders")
        },
        onError: (error) => {
            // setError(`Error when deleting the resource: ${error}`)
            console.error(error)
        },
    })

    const handleManufacturingOrderDelete = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteManufacturingOrderMutation.mutate(
            { id },
            {
                onSuccess: (data) => { }
            }
        )
    }

    return (
        <div className="container p-4">
            <div className="flex">
                <Link
                    href="/manufacturing-orders/create"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
                >
                    Create
                </Link>
            </div>

            <div className="block sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Manufacturing Orders {manufacturingOrders.length} / {totalItems}</p>
                <p className="pt-2">
                    <span>items per page</span>
                    <select name="perPage" id="perPage"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1 ml-1 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        value={perPage}
                        onChange={(event) => {
                            if (event.target.value) {
                                setPerPage(event.target.value)
                            }
                        }}>
                        {ORDERS_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            {/* <div className="grid grid-cols-1 gap-2 place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3"> */}
            <div className="grid grid-cols-1 gap-2 place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3">
                {manufacturingOrders.map((order) => (
                    <div key={order.id}
                        className="max-w-sm bg-white border border-gray-200 rounded-lg shadow p-2 m-2">
                        <div className="p-5">
                            <h2 className="text-gray-500">{order.id}</h2>

                            <ArticleElement id={order.article as string} />

                            <p>
                                <strong>Created At:</strong>
                                {new Date(order.createdAt || '').toLocaleDateString()}
                            </p>

                            <p>
                                <strong>Total Quantity:</strong>
                                {order.totalQuantity}
                            </p>

                            <p>
                                <strong>Unit Price:</strong>
                                ${parseFloat(order.unitPrice || '').toFixed(2)}
                            </p>

                            <p>
                                <strong>Total Price:</strong>
                                ${parseFloat(order.totalPrice || '').toFixed(3)}
                            </p>

                            <p>
                                <strong>Observation:</strong>
                                {/* react-quill return "<p><br></p>" when text is empty*/}
                                {order["observation"] && (order.observation !== "<p><br></p>")
                                    ? (
                                        <span className="line-clamp-3 prose max-w-full"
                                            dangerouslySetInnerHTML={{ __html: `${order["observation"]}` ?? "" }}
                                        />
                                    )
                                    : <></>
                                }
                            </p>

                            <p className="flex">
                                <strong className="w-24">Urgent:</strong>
                                {order.urgent
                                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            </p>

                            <p className="flex">
                                <strong className="w-24">Launched:</strong>
                                {order.launched
                                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            </p>

                            <p className="flex">
                                <strong className="w-24">Denied:</strong>
                                {order.denied
                                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            </p>

                            <hr className="m-2" />

                            <div className="flex justify-between">
                                <div className="flex items-center mr-2 ">
                                    <Link
                                        href={getItemPath(
                                            order["@id"],
                                            "/manufacturing-orders/[id]"
                                        )}
                                        className="flex font-mono text-green-500 hover:text-green-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 mr-1"
                                        >
                                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Show
                                    </Link>
                                </div>
                                <div className="flex items-center mr-2">
                                    <Link
                                        href={getItemPath(
                                            order["@id"],
                                            "/manufacturing-orders/[id]/edit"
                                        )}
                                        className="flex font-mono text-cyan-500 hover:text-cyan-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 mr-1"
                                        >
                                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                        </svg>
                                        Edit
                                    </Link>
                                </div>
                                {
                                    order["@id"] && (
                                        <div className="flex items-center mr-2">
                                            <button
                                                className="flex items-center font-mono text-lg text-red-500 hover:text-red-800"
                                                onClick={() => {
                                                    if (order["@id"]) {
                                                        handleManufacturingOrderDelete(order["@id"])
                                                    }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5 mr-1" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
