import { ChangeEvent, FunctionComponent, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useMutation } from "react-query"
import { ErrorMessage, Formik, FormikHelpers } from "formik"
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess"
import { Article } from "../../types/Article"
import SnackbarCustomized, { AlertColor, SnackbarOrigin, SnackbarState } from "../SnackbarCustomized"
import Link from "next/link"
import { ArticleImage } from "../../types/ArticleImage"
import { ARTICLE_IMAGE_URL } from "../../config/entrypoint"
import RichTextEditor from "../RichTextEditor"
import { EditArticleProps } from "../../pages/articles/[id]/edit"
import ImageElement from "./ImageElement"
import Image from "next/image"

interface FormProps extends EditArticleProps {
    article?: Article
}

interface SaveParams {
    values: Article
}

interface DeleteParams {
    id: string
}

const snackbarPosition: SnackbarOrigin = {
    vertical: 'bottom',		// 'top' | 'bottom'
    horizontal: 'center'	// 'left' | 'center' | 'right'
}

const saveArticle = async ({ values }: SaveParams) =>
    await fetch<Article>(!values["@id"] ? "/api/articles" : values["@id"], {
        method: !values["@id"] ? "POST" : "PUT",
        body: JSON.stringify(values),
    })

const deleteArticle = async (id: string) =>
    await fetch<Article>(id, { method: "DELETE" })

const uploadImage = async (formData: FormData) =>
    await fetch<ArticleImage>(
        ARTICLE_IMAGE_URL,
        { method: "POST", body: formData }
    )

export const Form: FunctionComponent<FormProps> = ({ article, client }) => {
    const [, setError] = useState<string | null>(null)
    const [, setShowSnackbar] = useState(true)
    const [image, setImage] = useState<File | undefined>(undefined)
    const imageRef = useRef<HTMLInputElement | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [composition, setComposition] = useState<string | undefined>(article?.composition || '')

    const router = useRouter()

    const saveMutation = useMutation<
        FetchResponse<Article> | undefined,
        Error | FetchError,
        SaveParams
    >((saveParams) => saveArticle(saveParams))

    const deleteMutation = useMutation<
        FetchResponse<Article> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteArticle(id), {
        onSuccess: () => {
            router.push("/articles")
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`)
            console.error(error)
        },
    })

    const handleDelete = () => {
        if (!article || !article["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteMutation.mutate({ id: article["@id"] })
    }

    const [snackbarState, setSnackbarState] = useState<SnackbarState>({
        open: false,			// CustomizedSnackbar -> SnackbarState<I>
        severity: 'info',	// CustomizedSnackbar -> SnackbarState<I>
        message: 'UNKNOWN',		// CustomizedSnackbar -> SnackbarState<I>
        vertical: snackbarPosition.vertical,		// 'top' | 'bottom' Snackbar.d.ts -> SnackbarOrigin<I>
        horizontal: snackbarPosition.horizontal,	// 'start' | 'center' | 'end' Snackbar.d.ts -> SnackbarOrigin<I>
    })

    const handleSnackbarOpen = (newState: any, severity: AlertColor, message: string | string[]) => {
        setShowSnackbar(true)
        setSnackbarState({ ...newState, open: true, severity: severity, message: message })
    }

    const handleSnackbarClose = () => {
        setSnackbarState({ ...snackbarState, open: false })
    }

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0])

            // use reader to preview image
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const handleImageReset = () => {
        if (imageRef.current) {
            imageRef.current.value = ""
            setImage(undefined)
        }
    }

    const handleSubmit = async (values: Article, { setStatus, setSubmitting, setErrors }: FormikHelpers<Article>) => {
        const isCreation = !values["@id"]

        values.client = client?.["@id"]
        values.composition = composition

        console.log("image: ", image)

        if (image) {
            const formData = new FormData()
            formData.append("file", image)
            try {
                const response = await uploadImage(formData)
                if (response && response.data) {
                    values.image = response.data["@id"]
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            values.image = undefined
        }

        console.log("values: ", values)

        saveMutation.mutate(
            { values },
            {
                onSuccess: () => {
                    setStatus({
                        isValid: true,
                        msg: `Article ${isCreation ? "created" : "updated"}.`,
                    })
                    handleSnackbarOpen(snackbarPosition, "success", `Article ${isCreation ? "created" : "updated"}.`)
                    // router.push("/articles")
                },
                onError: (error) => {
                    // console.log(error)
                    setStatus({
                        isValid: false,
                        msg: `${error.message}`,
                    })
                    if ("fields" in error) {
                        setErrors(error.fields)
                    }
                    handleSnackbarOpen(snackbarPosition, "error", error.message)
                },
                onSettled: () => {
                    setSubmitting(false)
                },
            }
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Link
                href="/articles"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>
            <h1 className="text-3xl my-2">
                {article ? `Edit Article` : `Create Article`}
            </h1>
            <Formik
                initialValues={article ? { ...article, } : new Article()}
                validate={(values) => {
                    const errors: any = {}
                    // add your validation logic here
                    if (!values.designation) {
                        errors.designation = "Required"
                    }
                    if (!values.model) {
                        errors.model = "Required"
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
                }) => (
                    <form className="shadow-md p-4" onSubmit={handleSubmit} autoComplete="off">
                        {/* Image Preview */}
                        <div className="m-4 p-2 border rounded-lg flex justify-center">
                            {imagePreview
                                ? <Image src={imagePreview} width={230} height={230} alt="image preview" style={{ backgroundColor: '#F6F6F6' }} />
                                : <ImageElement id={article?.image} />
                            }
                        </div>

                        {/* Image */}
                        <div className="relative w-full pb-6 group">
                            <label
                                htmlFor="article_image"
                                className="peer-focus:font-mono font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Image
                            </label>
                            <div className="flex">
                                <input
                                    name="image"
                                    id="article_image"
                                    ref={imageRef}
                                    // value={values.image ?? ""}
                                    type="file"
                                    placeholder=""
                                    className={`block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${errors.image && touched.image
                                            ? "border-red-500"
                                            : ""
                                        }`}
                                    aria-invalid={
                                        errors.image && touched.image ? "true" : undefined
                                    }
                                    onChange={handleImageChange}
                                    onBlur={handleBlur}
                                // required
                                />
                                <button
                                    className='ml-2'
                                    type='button'
                                    onClick={handleImageReset}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="image"
                            />
                        </div>

                        {/* Designation */}
                        <div className="relative z-0 w-full pb-6 group">
                            <input
                                name="designation"
                                id="article_designation"
                                value={values.designation ?? ""}
                                type="text"
                                placeholder=" "
                                className={`block py-2.5 px-0 w-full font-mono text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600  peer ${errors.designation && touched.designation
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                aria-invalid={
                                    errors.designation && touched.designation ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <label
                                htmlFor="article_designation"
                                className="peer-focus:font-mono absolute font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Designation
                            </label>
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="designation"
                            />
                        </div>

                        {/* Model */}
                        <div className="relative z-0 w-full pb-6 group">
                            <input
                                name="model"
                                id="article_model"
                                value={values.model ?? ""}
                                type="text"
                                placeholder=" "
                                className={`block py-2.5 px-0 w-full font-mono text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600  peer ${errors.model && touched.model
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                aria-invalid={
                                    errors.model && touched.model ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <label
                                htmlFor="article_model"
                                className="peer-focus:font-mono absolute font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Model
                            </label>
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="model"
                            />
                        </div>

                        {/* Composition */}
                        <div className="relative z-0 w-full pb-6 group">
                            <label
                                htmlFor="article_model"
                                className="peer-focus:font-mono font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Composition
                            </label>
                            <RichTextEditor data={composition} setData={setComposition} />
                        </div>

                        {/* Buttons */}
                        <div className="flex" >
                            <button
                                type="submit"
                                className="text-white bg-cyan-500 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 "
                                disabled={isSubmitting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send w-5 h-5 mr-2 -ml-1" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                                Submit
                            </button>
                            {/* no need to show delete button if MO exist with current article */}
                            {article && article.manufacturingOrders && article.manufacturingOrders?.length === 0 && (
                                <button
                                    type="button"
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 "
                                    onClick={handleDelete}
                                >
                                    Delete
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash w-5 h-5 ml-2 -mr-1" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* status | Snackbar */}
                        {status && status.msg && (
                            <SnackbarCustomized snackbarState={snackbarState} handleSnackbarClose={handleSnackbarClose} />
                        )}

                    </form>
                )}
            </Formik>
        </div>
    )
}
