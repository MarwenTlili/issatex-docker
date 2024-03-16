import { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import SelectManyToOne from "../formik/SelectManyToOne";
import { hasSpaces, isUppercase, } from "../../utils/tools";

interface Props {
    employee?: Employee;
}

interface SaveParams {
    values: Employee;
}

interface DeleteParams {
    id: string;
}

const saveEmployee = async ({ values }: SaveParams) =>
    await fetch<Employee>(!values["@id"] ? "/api/employees" : values["@id"], {
        method: !values["@id"] ? "POST" : "PUT",
        body: JSON.stringify(values),
    });

const deleteEmployee = async (id: string) =>
    await fetch<Employee>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ employee }) => {
    const [, setError] = useState<string | null>(null);
    const router = useRouter();
    const [recruitmentAt, setRecruitmentAt] = useState<string>(employee?.recruitmentAt?.split('T')[0] || "")

    const saveMutation = useMutation<
        FetchResponse<Employee> | undefined,
        Error | FetchError,
        SaveParams
    >((saveParams) => saveEmployee(saveParams));

    const deleteMutation = useMutation<
        FetchResponse<Employee> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteEmployee(id), {
        onSuccess: () => {
            router.push("/employees");
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`);
        },
    });

    const handleDelete = () => {
        if (!employee || !employee["@id"]) return;
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        deleteMutation.mutate({ id: employee["@id"] });
    };

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/employees"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {`< Back to list`}
            </Link>
            <h1 className="text-3xl my-2">
                {employee ? `Edit Employee ${employee.id}` : `Create Employee`}
            </h1>
            <Formik
                initialValues={
                    employee
                        ? {
                            ...employee,
                        }
                        : new Employee()
                }
                validate={(values) => {
                    const errors: Partial<Employee> = {};
                    // add your validation logic here
                    if (!values.firstName) {
                        errors.firstName = 'first name is required !';
                    }
                    if (!values.lastName) {
                        errors.lastName = 'last name is required !';
                    }
                    if (!values.registrationCode) {
                        errors.registrationCode = 'registration code is required !';
                    }
                    if (!isUppercase(values.registrationCode)) {
                        errors.registrationCode = 'registration code should be in Uppercase !';
                    }
                    if (hasSpaces(values.registrationCode)) {
                        errors.registrationCode = 'registration code should not have spaces !';
                    }
                    if (!values.category) {
                        errors.category = 'category is required !';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
                    /**
                     * if ilot is not selected, then set it to undefined 
                     * to prevent submitting emty string of ilot
                     */
                    if (values.ilot === "") {
                        values.ilot = undefined
                    }

                    const isCreation = !values["@id"];
                    saveMutation.mutate(
                        { values },
                        {
                            onSuccess: () => {
                                setStatus({
                                    isValid: true,
                                    msg: `Element ${isCreation ? "created" : "updated"}.`,
                                });
                                router.push("/employees");
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
                    isValid
                }) => (
                    <form className="shadow-md p-4" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_firstName"
                            >
                                firstName
                            </label>
                            <input
                                name="firstName"
                                id="employee_firstName"
                                value={values.firstName ?? ""}
                                type="text"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.firstName && touched.firstName ? "border-red-500" : ""
                                    }`}
                                aria-invalid={
                                    errors.firstName && touched.firstName ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="firstName"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_lastName"
                            >
                                lastName
                            </label>
                            <input
                                name="lastName"
                                id="employee_lastName"
                                value={values.lastName ?? ""}
                                type="text"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.lastName && touched.lastName ? "border-red-500" : ""
                                    }`}
                                aria-invalid={
                                    errors.lastName && touched.lastName ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="lastName"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_registrationCode"
                            >
                                registrationCode
                                <span className="mt-2 text-sm font-thin text-gray-500 dark:text-gray-400"> ex: FIRSTNAME_LASTNAME</span>
                            </label>
                            <input
                                name="registrationCode"
                                id="employee_registrationCode"
                                value={values.registrationCode ?? ""}
                                type="text"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.registrationCode && touched.registrationCode
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                aria-invalid={
                                    errors.registrationCode && touched.registrationCode
                                        ? "true"
                                        : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="registrationCode"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_category"
                            >
                                category
                            </label>
                            <input
                                name="category"
                                id="employee_category"
                                value={values.category ?? ""}
                                type="text"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.category && touched.category ? "border-red-500" : ""
                                    }`}
                                aria-invalid={
                                    errors.category && touched.category ? "true" : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="category"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_recruitmentAt"
                            >
                                recruitmentAt
                            </label>
                            <input
                                name="recruitmentAt"
                                id="employee_recruitmentAt"
                                value={recruitmentAt}
                                type="date"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.recruitmentAt && touched.recruitmentAt
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                aria-invalid={
                                    errors.recruitmentAt && touched.recruitmentAt
                                        ? "true"
                                        : undefined
                                }
                                onChange={(event) => {
                                    setRecruitmentAt(event.target.value);
                                    handleChange(event);
                                }}
                                onBlur={handleBlur}
                            // {...register('dateTimeImmutable')}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="recuruitmentAt"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="employee_ilot"
                            >
                                Ilot
                            </label>
                            {/* formik select field */}
                            <Field name="ilot" as={SelectManyToOne} reference="/api/ilots" optionText="name" />
                        </div>

                        {/* <div className="mb-2">
                            <div className="text-gray-700 block text-sm font-bold">
                                employeeAttendances
                            </div>
                            <FieldArray
                                name="employeeAttendances"
                                render={(arrayHelpers) => (
                                    <div className="mb-2" id="employee_employeeAttendances">
                                        {values.employeeAttendances &&
                                            values.employeeAttendances.length > 0 ? (
                                            values.employeeAttendances.map(
                                                (item: any, index: number) => (
                                                    <div key={index}>
                                                        <Field name={`employeeAttendances.${index}`} />
                                                        <button
                                                            type="button"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => arrayHelpers.insert(index, "")}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => arrayHelpers.push("")}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                )}
                            />
                        </div> */}
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
                            className={`inline-block mt-2 text-sm text-white font-bold py-2 px-4 rounded ${isValid
                                ? "bg-cyan-500 hover:bg-cyan-700"
                                : "bg-gray-500 hover:bg-gray-700"} `}
                            disabled={isSubmitting || !isValid}
                        >
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
            <div className="flex space-x-2 mt-4 justify-end">
                {employee && (
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
