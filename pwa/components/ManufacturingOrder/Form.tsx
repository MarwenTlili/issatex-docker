import { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik"
import { useMutation } from "react-query"
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import Select from "../article/Select"
import * as Yup from "yup"
import { MediaObject } from "../../types/MediaObject"
import { TECHNICAL_DOCUMENT_URL } from "../../config/entrypoint"
import { toLocaleIso } from "../../utils/tools"
import { ManufacturingOrderSize } from "../../types/ManufacturingOrderSize"
import OrderSizes from "../ManufacturingOrderSize/OrderSizes"
import { EditManufacturingOrderProps } from "../../pages/manufacturing-orders/[id]/edit"
import RichTextEditor from "../RichTextEditor"
import Link from "next/link"

interface ManufacturingOrderSaveParams {
    values: ManufacturingOrder
}

interface ManufacturingOrderSizeSaveParams {
    manufacturingOrderSize: ManufacturingOrderSize
}

interface DeleteProps {
    id: string
}

const saveManufacturingOrder = async ({ values }: ManufacturingOrderSaveParams) =>
    await fetch<ManufacturingOrder>(
        !values["@id"] ? "/api/manufacturing_orders" : values["@id"],
        {
            method: !values["@id"] ? "POST" : "PUT",
            body: JSON.stringify(values),
        }
    )

const deleteManufacturingOrder = async (id: string) =>
    await fetch<ManufacturingOrder>(id, { method: "DELETE" })

const uploadTechnicalDocument = async (FormData: FormData) =>
    await fetch<MediaObject>(
        TECHNICAL_DOCUMENT_URL,
        { method: "POST", body: FormData }
    )

const saveManufacturingOrderSize = async ({ manufacturingOrderSize }: ManufacturingOrderSizeSaveParams) =>
    await fetch<ManufacturingOrderSize>(
        !manufacturingOrderSize["@id"] ? "/api/manufacturing_order_sizes" : manufacturingOrderSize["@id"],
        {
            method: !manufacturingOrderSize["@id"] ? "POST" : "PUT",
            body: JSON.stringify(manufacturingOrderSize),
        }
    )

const deleteManufacturingOrderSize = async (id: string) =>
    await fetch<ManufacturingOrderSize>(id, { method: "DELETE" })

export const Form: FunctionComponent<EditManufacturingOrderProps> = ({
    client,
    articleSizes,
    clientArticles,
    manufacturingOrder,
    manufacturingOrderSizes
}) => {
    const router = useRouter()
    const [, setError] = useState<string | null>(null)	// form errors
    const [urgent, setUrgent] = useState<boolean>(manufacturingOrder?.urgent || false)
    const [selectedArticle, setSelectedArticle] = useState<string | undefined>(manufacturingOrder?.article as string || undefined)
    const [technicalDocumentFile, setTecnicalDocumentFile] = useState<File | undefined>(undefined)
    const [totalQuantity, setTotalQuantity] = useState<number | undefined>(manufacturingOrder?.totalQuantity || 0)
    const [unitPrice, setUnitPrice] = useState<string | undefined>(manufacturingOrder?.unitPrice || undefined)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    let [selectedSizes, setSelectedSizes] = useState<ManufacturingOrderSize[] | undefined>(() => {
        let temp: ManufacturingOrderSize[] | undefined = []

        if (articleSizes && manufacturingOrderSizes) {  // Edit Mode
            temp = articleSizes.map(size => {
                const orderSize = manufacturingOrderSizes.find(mos => mos.size === size['@id'])
                if (orderSize) {
                    return orderSize
                } else {
                    return new ManufacturingOrderSize(undefined, 0, manufacturingOrder?.["@id"], size["@id"])
                }
            })
        } else {    // Create Mode
            temp = articleSizes?.map(size => {
                return new ManufacturingOrderSize(undefined, 0, manufacturingOrder?.["@id"], size["@id"])
            })
        }

        return temp
    })
    const [observation, setObservation] = useState<string | undefined>(manufacturingOrder?.observation || '')

    const technicalDocumentRef = useRef<HTMLInputElement | null>(null)

    const ManufacturingOrderSchema = Yup.object().shape({
        article: Yup.string().required()
    })

    const saveManufacturingOrderMutation = useMutation<
        FetchResponse<ManufacturingOrder> | undefined,
        Error | FetchError,
        ManufacturingOrderSaveParams
    >((saveParams) => saveManufacturingOrder(saveParams), {
        onSuccess: () => {
            router.push("/manufacturing-orders")
        }
    })

    const deleteManufacturingOrderMutation = useMutation<
        FetchResponse<ManufacturingOrder> | undefined,
        Error | FetchError,
        DeleteProps
    >(({ id }) => deleteManufacturingOrder(id), {
        onSuccess: () => {
            router.push("/manufacturing-orders")
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`)
            console.error(error)
        },
    })

    const deleteManufacturingOrderSizeMutation = useMutation<
        FetchResponse<ManufacturingOrderSize> | undefined,
        Error | FetchError,
        DeleteProps
    >(({ id }) => deleteManufacturingOrderSize(id))

    const saveManufacturingOrderSizeMutation = useMutation<
        FetchResponse<ManufacturingOrderSize> | undefined,
        Error | FetchError,
        ManufacturingOrderSizeSaveParams
    >((saveParams) => saveManufacturingOrderSize(saveParams))

    const handleManufacturingOrderDelete = () => {
        if (!manufacturingOrder || !manufacturingOrder["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteManufacturingOrderMutation.mutate({ id: manufacturingOrder["@id"] })
    }

    const handleTechnicalDocumentChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            setTecnicalDocumentFile(file)
        }
    }

    const handleTechnicalDocumentReset = () => {
        if (technicalDocumentRef.current) {
            technicalDocumentRef.current.value = ""
            setTecnicalDocumentFile(undefined)
        }
    }

    const onTotalQuantityChange = (newTotalQuantity: number) => {
        setTotalQuantity(newTotalQuantity)
    }

    const mergeManufacturingOrderSizes = (
        values: ManufacturingOrder,
        selectedSizes: ManufacturingOrderSize[] | undefined,
        isCreation: boolean,
        setSubmitting: { (isSubmitting: boolean): void },
        setStatus: { (status?: any): void }
    ) => {
        if (isCreation) {
            saveManufacturingOrderMutation.mutate(
                { values },
                {
                    onSuccess: (savedManufacturingOrder) => {
                        selectedSizes?.map((orderSize) => {
                            if (orderSize.quantity && orderSize.quantity > 0) {
                                const manufacturingOrderSize = new ManufacturingOrderSize(
                                    undefined,
                                    orderSize.quantity,
                                    savedManufacturingOrder?.data["@id"],
                                    orderSize.size
                                )
                                saveManufacturingOrderSizeMutation.mutate(
                                    { manufacturingOrderSize },
                                    {
                                        onSuccess: (savedManufacturingOrderSize) => {
                                            console.log(`saved Manufacturing Order Size "${savedManufacturingOrderSize?.data["@id"]}"`)
                                            // setStatus({
                                            //     isValid: true,
                                            //     msg: `saved Manufacturing Order Size "${savedManufacturingOrderSize?.data["@id"]}"`
                                            // })
                                        },
                                        onError: (error) => {
                                            setStatus({
                                                isValid: false,
                                                msg: `Error while saging Manufacturing Order Size: ${error} `
                                            })
                                            console.error(error)
                                        },
                                        onSettled: () => {
                                            setSubmitting(false)
                                        }
                                    }
                                )
                            }
                        })
                        setStatus({
                            isValid: true,
                            msg: `Saved new Manufacturing Order`
                        })
                    }
                }
            )
        } else {
            if (selectedSizes) {
                values.manufacturingOrderSize = selectedSizes
                    .filter(orderSize => {
                        if (orderSize.quantity === 0 && orderSize["@id"] && values.manufacturingOrderSize?.includes(orderSize["@id"])) {
                            const element: string | undefined = values.manufacturingOrderSize.find(id => id === orderSize["@id"])
                            if (element) {
                                let removed: boolean = false
                                deleteManufacturingOrderSizeMutation.mutate(
                                    { id: element },
                                    {
                                        onSuccess: (data) => {
                                            orderSize["@id"] = undefined
                                            orderSize.id = undefined
                                            removed = true
                                        }
                                    }
                                )
                                return !removed
                            }
                            return true
                        }
                        if (orderSize.quantity && orderSize.quantity > 0 && !orderSize["@id"]) {
                            const manufacturingOrderSize = new ManufacturingOrderSize(
                                undefined,
                                orderSize.quantity,
                                values["@id"],
                                orderSize.size
                            )
                            saveManufacturingOrderSizeMutation.mutate(
                                { manufacturingOrderSize },
                                {
                                    onSuccess: (response) => {
                                        if (response?.data) {
                                            // update selectedSize using size id
                                            setSelectedSizes(prev => {
                                                return prev?.map(item => {
                                                    if (item.size === response.data.size) {
                                                        return { ...item, "@id": response.data["@id"], "@type": response.data["@type"], id: response.data.id }
                                                    }
                                                    return item
                                                })
                                            })
                                        }

                                    }
                                }
                            )
                            // push id to values.manufacturingOrderSize
                            return true
                        }
                        return true
                    })
                    .map(orderSize => orderSize["@id"])
                    .filter((id): id is string => id !== undefined)

                saveManufacturingOrderMutation.mutate(
                    { values },
                    {
                        onSuccess: (data) => {
                            setStatus({
                                isValid: true,
                                msg: `saved Manufacturing Order`
                            })
                        },
                        onError: (error) => {
                            setStatus({
                                isValid: true,
                                msg: `Error while saving Manufacturing Order "${error}"`
                            })
                        }
                    }
                )

            }

        }
    }

    const handleSubmit = async (values: ManufacturingOrder, { setStatus, setSubmitting, setErrors }: FormikHelpers<ManufacturingOrder>) => {
        // check is this form is called for Create/Edit of ManufacturingOrder
        const isCreation = !values["@id"]

        values.createdAt = isCreation ? new Date(toLocaleIso(Date.now())) : values.createdAt
        if (client) values.client = client["@id"]
        values.urgent = urgent
        values.totalQuantity = totalQuantity
        values.totalPrice = totalPrice.toString()
        values.denied = isCreation ? false : values.denied
        values.launched = isCreation ? false : values.launched
        values.observation = observation

        // attach technicalDocumentFile to form values
        if (technicalDocumentFile) {
            const formData = new FormData()
            formData.append("file", technicalDocumentFile)
            try {
                const response = await uploadTechnicalDocument(formData)
                if (response && response.data) {
                    values.technicalDocument = response.data["@id"]
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            values.technicalDocument = undefined
        }

        mergeManufacturingOrderSizes(values, selectedSizes, isCreation, setSubmitting, setStatus)
    }

    useEffect(() => {
        if ((totalQuantity !== undefined) && (totalQuantity >= 0) && unitPrice) {
            setTotalPrice(totalQuantity * (Number(unitPrice)))
        }
        if (!unitPrice) {
            setTotalPrice(0)
        }
    }, [totalQuantity, unitPrice])

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/manufacturing-orders"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>
            <h1 className="text-3xl my-2">
                {manufacturingOrder ? `Edit Manufacturing Order` : `Create Manufacturing Order`}
            </h1>
            <Formik
                initialValues={manufacturingOrder ? { ...manufacturingOrder, } : new ManufacturingOrder()}
                validationSchema={ManufacturingOrderSchema}
                validate={(values) => {
                    const errors: ManufacturingOrder = {}
                    // add your validation logic here
                    if (!values.article) {
                        errors.article = "selecting article is required!"
                    }
                    return errors
                }}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    status,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    isValid
                }) => (
                    <form className="shadow-md p-4" onSubmit={handleSubmit} autoComplete="off">
                        {/* Urgent */}
                        {client?.isPrivileged && (
                            <div className="flex mb-2">
                                <label
                                    className="text-gray-700 block text-sm font-bold"
                                    htmlFor="manufacturingorder_urgent"
                                >
                                    Is it Urgent?
                                </label>
                                <Field
                                    type="checkbox"
                                    name="urgent"
                                    id="manufacturingorder_urgent"
                                    checked={urgent}
                                    placeholder=""
                                    className={`ml-2 mt-1 block ${errors.urgent && touched.urgent ? "border-red-500" : ""}`}
                                    aria-invalid={errors.urgent && touched.urgent ? "true" : undefined}
                                    onChange={() => setUrgent(!urgent)}
                                    onBlur={handleBlur} />
                            </div>
                        )}

                        {/* Article Selecting */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="article"
                            >
                                Article
                            </label>
                            <Select
                                clientArticles={clientArticles}
                                manufacturingOrder={values}
                                selectedArticle={selectedArticle}
                                setSelectedArticle={setSelectedArticle}
                                errors={errors}
                                touched={touched}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 block"
                                name="article"
                                component="div" />
                        </div>

                        {/* Technical Document */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="manufacturingorder_technicalDocument"
                            >
                                Technical Document
                            </label>
                            <div className="flex">
                                <input
                                    ref={technicalDocumentRef}
                                    name="technicalDocument"
                                    id="manufacturingorder_technicalDocument"
                                    type="file"
                                    placeholder=""
                                    className={`mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${errors.technicalDocument && touched.technicalDocument
                                        ? "border-red-500"
                                        : ""}`}
                                    aria-invalid={errors.technicalDocument && touched.technicalDocument
                                        ? "true"
                                        : undefined}
                                    onChange={handleTechnicalDocumentChange}
                                    onBlur={handleBlur} />
                                <button
                                    className='ml-2'
                                    type='button'
                                    onClick={handleTechnicalDocumentReset}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="technicalDocument" />
                        </div>

                        {/* Unit Time */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="manufacturingorder_unitTime"
                            >
                                Unit Time
                            </label>
                            <input
                                name="unitTime"
                                id="manufacturingorder_unitTime"
                                value={values.unitTime ?? ""}
                                type="number"
                                placeholder=""
                                className={`block w-full ${errors.unitTime && touched.unitTime
                                    ? "border-red-500"
                                    : ""}`}
                                aria-invalid={errors.unitTime && touched.unitTime
                                    ? "true"
                                    : undefined}
                                onChange={handleChange}
                                onBlur={handleBlur} />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="unitTime" />
                        </div>

                        {/* Unit Price */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="manufacturingorder_unitPrice"
                            >
                                Unit Price
                            </label>
                            <input
                                name="unitPrice"
                                id="manufacturingorder_unitPrice"
                                value={unitPrice ?? ""}
                                type="number"
                                placeholder=""
                                className={`block w-full ${errors.unitPrice && touched.unitPrice
                                    ? "border-red-500"
                                    : ""}`}
                                aria-invalid={errors.unitPrice && touched.unitPrice
                                    ? "true"
                                    : undefined}
                                onChange={(e) => {
                                    setUnitPrice(e.target.value)
                                    values.unitPrice = e.target.value
                                }}
                                onBlur={handleBlur} />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="unitPrice" />
                        </div>

                        {/* Sizes */}
                        <div className="mb-2">
                            <div className="text-gray-700 block text-sm font-bold">
                                Sizes
                            </div>
                            <OrderSizes
                                articleSizes={articleSizes}
                                selectedSizes={selectedSizes}
                                setSelectedSizes={setSelectedSizes}
                                onTotalQuantityChange={onTotalQuantityChange}
                            />
                        </div>

                        {/* Total Quantity */}
                        <div className="mb-2 flex">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="manufacturingorder_totalQuantity"
                            >
                                Total Quantity
                            </label>
                            <span className="text-xl ml-2">
                                {totalQuantity ?? "0"}
                            </span>
                        </div>

                        {/* Total Price */}
                        <div className="mb-2 flex">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="manufacturingorder_totalPrice"
                            >
                                Total Price
                            </label>
                            <span className="text-xl ml-2">
                                {totalPrice ?? "0"}
                            </span>
                        </div>

                        {/* Observation */}
                        <RichTextEditor data={observation} setData={setObservation} />

                        {status && status.msg && (
                            <div
                                className={`border px-4 py-3 my-4 rounded ${status.isValid
                                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                                    : "text-red-700 border-red-400 bg-red-100"}`}
                                role="alert"
                            >
                                {status.msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`inline-block mt-2 text-xl text-white font-bold py-2 px-4 rounded 
								${isValid ? "bg-cyan-500 hover:bg-cyan-700" : "bg-gray-500 hover:bg-gray-700"}`}
                            disabled={isSubmitting}
                        >
                            {manufacturingOrder ? "Update" : "Create"}
                        </button>

                        {manufacturingOrder && (
                            <button
                                type="button"
                                className="inline-flex ml-2 text-xl text-white font-bold py-2 px-4 rounded bg-red-700 text-center items-center hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                                onClick={handleManufacturingOrderDelete}
                            >
                                Delete
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash w-5 h-5 ml-2 -mr-1" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                            </button>
                        )}

                        {/* <div>
                            <span>isSubmitting: {isSubmitting ? "true" : "false"}</span><br />
                            <span>isValid: {isValid ? "true" : "false"}</span>
                        </div> */}

                    </form>
                )}
            </Formik>
        </div>
    )
}
