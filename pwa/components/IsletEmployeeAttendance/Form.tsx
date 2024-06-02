import { FunctionComponent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik"
import { useMutation } from "react-query"

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess"
import { IsletEmployeeAttendance } from "../../types/IsletEmployeeAttendance"
import { CreateIsletEmployeeAttendance } from "../../pages/islet-employee-attendances/create"
import dynamic from "next/dynamic"
import { Attendance } from "../../types/Attendance"
import * as Yup from 'yup'
import { getTimeFromISODateTime, isISODateTimeString } from "../../utils/tools"

const DynamicSelect = dynamic(() => import('react-select'), {
    ssr: false,
    loading: () => <div>Loading list ...</div>,
})

interface FormProps extends CreateIsletEmployeeAttendance {
    isletEmployeeAttendance?: IsletEmployeeAttendance
}

interface SaveParams {
    values: IsletEmployeeAttendance
}

interface AttendanceSaveParams {
    attendance: Attendance
}

interface DeleteParams {
    id: string
}

interface Option {
    value: string | undefined
    label: string
}

const saveAttendance = async ({ attendance }: AttendanceSaveParams) =>
    await fetch<Attendance>(!attendance["@id"] ? "/api/attendances" : attendance["@id"], {
        method: !attendance["@id"] ? "POST" : "PUT",
        body: JSON.stringify(attendance),
    })

const saveIsletEmployeeAttendance = async ({ values }: SaveParams) =>
    await fetch<IsletEmployeeAttendance>(
        !values["@id"] ? "/api/islet_employee_attendances" : values["@id"],
        {
            method: !values["@id"] ? "POST" : "PUT",
            body: JSON.stringify(values),
        }
    )

const deleteIsletEmployeeAttendance = async (id: string) =>
    await fetch<IsletEmployeeAttendance>(id, { method: "DELETE" })

const deleteAttendance = async (id: string) =>
    await fetch<Attendance>(id, { method: "DELETE" })

const validationSchema = Yup.object().shape({
    employee: Yup.string().required('Employee is required'),
    islet: Yup.string().required('Islet is required'),
    attendance: Yup.object().shape({
        dateAt: Yup.string().required('Date is required'),
        startAt: Yup.string().required('Start time is required'),
        endAt: Yup.string().required('End time is required'),
    })
})

export const Form: FunctionComponent<FormProps> = ({ isletEmployeeAttendance, employees, islets }) => {
    const [, setError] = useState<string | null>(null)
    const router = useRouter()

    const initialValues = isletEmployeeAttendance ?
        { ...isletEmployeeAttendance }
        : new IsletEmployeeAttendance({})

    if (initialValues.attendance && typeof initialValues.attendance !== 'string'
        && initialValues.attendance.startAt && isISODateTimeString(initialValues.attendance.startAt)
    ) {
        initialValues.attendance.startAt = getTimeFromISODateTime(initialValues.attendance.startAt)
    }
    if (initialValues.attendance && typeof initialValues.attendance !== 'string'
        && initialValues.attendance.endAt && isISODateTimeString(initialValues.attendance.endAt)
    ) {
        initialValues.attendance.endAt = getTimeFromISODateTime(initialValues.attendance.endAt)
    }

    const employeeOptions: Option[] = employees ?
        employees.map(employee => ({
            value: employee["@id"],
            label: `${employee.firstName} - ${employee.lastName} [${employee.id}]`
        }))
        : []

    const isletOptions: Option[] = islets ?
        islets.map(islet => ({
            value: islet["@id"],
            label: `${islet.name}` || "..."
        }))
        : []

    const saveMutation = useMutation<
        FetchResponse<IsletEmployeeAttendance> | undefined,
        Error | FetchError,
        SaveParams
    >((saveParams) => saveIsletEmployeeAttendance(saveParams))

    const deleteMutation = useMutation<
        FetchResponse<IsletEmployeeAttendance> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteIsletEmployeeAttendance(id), {
        onSuccess: () => {
            router.push("/islet-employee-attendances")
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`)
            console.error(error)
        },
    })

    const deleteAttendanceMutation = useMutation<
        FetchResponse<IsletEmployeeAttendance> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteAttendance(id), {
        onSuccess: () => { },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`)
        }
    })

    const handleDelete = () => {
        if (!isletEmployeeAttendance || !isletEmployeeAttendance["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteMutation.mutate({ id: isletEmployeeAttendance["@id"] })
    }

    const attendanceSaveMutation = useMutation<
        FetchResponse<Attendance> | undefined,
        Error | FetchError,
        AttendanceSaveParams
    >((attendanceSaveParams) => saveAttendance(attendanceSaveParams))

    const handleSubmit = async (
        values: IsletEmployeeAttendance,
        { setSubmitting, setStatus, setErrors }: FormikHelpers<IsletEmployeeAttendance>
    ) => {
        const isCreation = !values["@id"]

        try {
            // Step 1: Submit the Attendance data and get the ID
            const attendance = values.attendance as Attendance

            if (attendance && attendance.dateAt && attendance.startAt && attendance.endAt) {
                const attendanceFetchResponse = await attendanceSaveMutation.mutateAsync(
                    { attendance },
                    {
                        onError: (error) => {
                            setStatus({ isValid: false, msg: 'An error occurred while saving the Attendance!' })
                            console.error("An error occurred while saving the Attendance:", error);
                        }
                    }
                )

                if (attendanceFetchResponse?.data["@id"]) {
                    // Step 2: Use the Attendance ID to submit IsletEmployeeAttendance
                    const isletEmployeeAttendanceData = {
                        ...values,
                        attendance: attendanceFetchResponse.data["@id"]
                    }

                    await saveMutation.mutateAsync(
                        { values: isletEmployeeAttendanceData },
                        {
                            onError: (error) => {
                                setStatus({ isValid: false, msg: 'An error occurred while saving the EmployeeAttendance!' })
                                console.error("An error occurred while saving the EmployeeAttendance:", error);
                                // Step 3: RollBack - deete Attendance when IsletEmployeeAttendance failed
                                if (attendanceFetchResponse.data["@id"])
                                    deleteAttendanceMutation.mutate({ id: attendanceFetchResponse.data["@id"] })
                            },
                            onSuccess: (data) => {
                                setStatus({ isValid: true, msg: 'Employee Attendance saved successfully!' })
                            }
                        }
                    )
                }
            }
        } catch (error) {
            setStatus({ isValid: false, msg: 'An error occurred while saving the IsletEmployeeAttendance.' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/islet-employee-attendances"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {`< Back to list`}
            </Link>
            <h1 className="text-1xl my-2">
                {isletEmployeeAttendance
                    ? `Edit Attendance ${isletEmployeeAttendance.id}`
                    : `Create Attendance`}
            </h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    status,
                    errors,
                    touched,
                    isSubmitting,
                    isValid,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <form className="shadow-md p-4 mb-4" onSubmit={handleSubmit}>
                        {/* Employee select */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="isletEmployeeAttendance_employee"
                            >
                                Employee
                            </label>
                            <DynamicSelect
                                id="isletEmployeeAttendance_employee"
                                options={employeeOptions}
                                name={"employee"}
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                value={employeeOptions.find(option => option.value === values.employee)}
                                onChange={(option) => setFieldValue('employee', (option as Option).value)}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full ${errors.employee && touched.employee ? "border-red-500" : ""
                                    }`}
                                aria-invalid={
                                    errors.employee && touched.employee ? "true" : undefined
                                }
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="employee"
                            />
                        </div>

                        {/* Islet select */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="isletemployeeattendance_islet"
                            >
                                Islet
                            </label>
                            <DynamicSelect id="isletemployeeattendance_islet"
                                options={isletOptions}
                                name={"islet"}
                                classNamePrefix="select"
                                isClearable={true}
                                isSearchable={true}
                                value={isletOptions.find(option => option.value === values.islet)}
                                onChange={(option) => setFieldValue('islet', (option as Option).value)}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full ${errors.islet && touched.islet ? "border-red-500" : ""}`}
                                aria-invalid={errors.islet && touched.islet ? "true" : undefined}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="islet"
                            />
                        </div>

                        {/* Day input */}
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="isletemployeeattendance_attendanceDateAt"
                            >
                                Date
                            </label>
                            <Field
                                id="isletemployeeattendance_attendanceDateAt"
                                name="attendance.dateAt"
                                type="date"
                                value={((values?.attendance as Attendance).dateAt) ?
                                    new Date((values.attendance as Attendance).dateAt || "").toISOString().split('T')[0]
                                    : ""}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="attendance.dateAt"
                            />
                        </div>

                        {/* time input */}
                        <div className="mb-2 flex flex-row justify-between md:justify-start md:space-x-4">
                            <div>
                                <label
                                    className="text-gray-700 block text-sm font-bold"
                                    htmlFor="isletemployeeattendance_attendanceStartAt"
                                >
                                    Start At
                                </label>

                                <Field
                                    id="isletemployeeattendance_attendanceStartAt"
                                    name="attendance.startAt"
                                    type="time"
                                    value={(values.attendance as Attendance)?.startAt || ''}
                                    onChange={handleChange}
                                />

                                <ErrorMessage
                                    className="text-xs text-red-500 pt-1"
                                    component="div"
                                    name="attendance.startAt"
                                />
                            </div>

                            <div>
                                <label
                                    className="text-gray-700 block text-sm font-bold"
                                    htmlFor="isletemployeeattendance_attendanceEndAt"
                                >
                                    End At
                                </label>

                                <Field
                                    id="isletemployeeattendance_attendanceEndAt"
                                    name="attendance.endAt"
                                    type="time"
                                    value={(values.attendance as Attendance)?.endAt || ''}
                                />

                                <ErrorMessage
                                    className="text-xs text-red-500 pt-1"
                                    component="div"
                                    name="attendance.endAt"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                type="submit"
                                className="inline-block bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold rounded w-20 h-10"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                            {isletEmployeeAttendance && (
                                <button
                                    className="inline-block border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            )}

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
                    </form>
                )
                }
            </Formik>
        </div>
    )
}
