import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { ProductionDate } from "../../types/ProductionDate";

interface Props {
    productiondate?: ProductionDate;
}

export interface ProductionDateSaveParams {
    productionDate: ProductionDate;
}

interface DeleteParams {
    id: string;
}

export const saveProductionDate = async ({ productionDate }: ProductionDateSaveParams) =>
    await fetch<ProductionDate>(
        !productionDate["@id"] ? "/api/production_dates" : productionDate["@id"],
        {
            method: !productionDate["@id"] ? "POST" : "PUT",
            body: JSON.stringify(productionDate),
        }
    );

export const deleteProductionDate = async (id: string) =>
    await fetch<ProductionDate>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ productiondate }) => {
    const [, setError] = useState<string | null>(null);
    const router = useRouter();

    const saveMutation = useMutation<
        FetchResponse<ProductionDate> | undefined,
        Error | FetchError,
        ProductionDateSaveParams
    >((saveParams) => saveProductionDate(saveParams));

    const deleteMutation = useMutation<
        FetchResponse<ProductionDate> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteProductionDate(id), {
        onSuccess: () => {
            router.push("/productiondates");
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`);
            console.error(error);
        },
    });

    const handleDelete = () => {
        if (!productiondate || !productiondate["@id"]) return;
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        deleteMutation.mutate({ id: productiondate["@id"] });
    };

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/productiondates"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {`< Back to list`}
            </Link>
            <h1 className="text-3xl my-2">
                {productiondate
                    ? `Edit ProductionDate ${productiondate["@id"]}`
                    : `Create ProductionDate`}
            </h1>
            <Formik
                initialValues={
                    productiondate
                        ? {
                            ...productiondate,
                        }
                        : new ProductionDate()
                }
                validate={() => {
                    const errors = {};
                    // add your validation logic here
                    return errors;
                }}
                onSubmit={(productionDate, { setSubmitting, setStatus, setErrors }) => {
                    const isCreation = !productionDate["@id"];
                    saveMutation.mutate(
                        { productionDate },
                        {
                            onSuccess: () => {
                                setStatus({
                                    isValid: true,
                                    msg: `Element ${isCreation ? "created" : "updated"}.`,
                                });
                                router.push("/api/production_dates");
                            },
                            onError: (error) => {
                                setStatus({
                                    isValid: false,
                                    msg: `${error.message}`,
                                });
                                if ("fields" in error) {
                                    setErrors(error.fields);
                                }
                            },
                            onSettled: () => {
                                setSubmitting(false);
                            },
                        }
                    );
                }}
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
                    <form className="shadow-md p-4" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="productiondate_dayAt"
                            >
                                dayAt
                            </label>
                            <input
                                name="dayAt"
                                id="productiondate_dayAt"
                                value={values.dayAt?.toLocaleString() ?? ""}
                                type="dateTime"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.dayAt && touched.dayAt ? "border-red-500" : ""
                                    }`}
                                aria-invalid={
                                    errors.dayAt && touched.dayAt ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="dayAt"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="productiondate_dailyProduction"
                            >
                                dailyProduction
                            </label>
                            <input
                                name="dailyProduction"
                                id="productiondate_dailyProduction"
                                value={values.dailyProduction ?? ""}
                                type="text"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.dailyProduction && touched.dailyProduction
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                aria-invalid={
                                    errors.dailyProduction && touched.dailyProduction
                                        ? "true"
                                        : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="dailyProduction"
                            />
                        </div>
                        {status && status.msg && (
                            <div
                                className={`border px-4 py-3 my-4 rounded ${status.isValid
                                        ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                                        : "text-red-700 border-red-400 bg-red-100"
                                    }`}
                                role="alert"
                            >
                                {status.msg}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
                            disabled={isSubmitting}
                        >
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
            <div className="flex space-x-2 mt-4 justify-end">
                {productiondate && (
                    <button
                        className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};
