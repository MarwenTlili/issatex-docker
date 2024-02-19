import { ChangeEvent, FunctionComponent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik"
import { useMutation } from "react-query"

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess"
import SelectManyToOne from "../formik/SelectManyToOne"
import { DailyProduction } from "../../types/DailyProduction"
import { WeeklySchedule } from "../../types/WeeklySchedule"

interface Props {
    dailyProduction?: DailyProduction
    weeklySchedules?: WeeklySchedule[] | undefined
    dailyProductions?: DailyProduction[] | undefined
    weeklySchedule?: string
}

interface SaveParams {
    values: DailyProduction
}

interface DeleteParams {
    id: string
}

const saveDailyProduction = async ({ values }: SaveParams) =>
    await fetch<DailyProduction>(
        !values["@id"] ? "/api/daily_productions" : values["@id"],
        {
            method: !values["@id"] ? "POST" : "PUT",
            body: JSON.stringify(values),
        }
    )

const deleteDailyProduction = async (id: string) =>
    await fetch<DailyProduction>(id, { method: "DELETE" })

export const Form: FunctionComponent<Props> = ({
    dailyProduction,
    weeklySchedules,
    dailyProductions,
    weeklySchedule
}) => {
    const [, setError] = useState<string | null>(null)
    const router = useRouter()
    const [selectedDay, setSelectedDay] = useState<string>(dailyProduction?.day?.split('T')[0] || "")
    /**
     * weeklySchedule from weeklySchedule/List
     * dailyProduction?.weeklySchedule from Edit 
     */
    const [selectedSchedule, setSelectedSchedule] = useState<string | undefined>(
        dailyProduction?.weeklySchedule || weeklySchedule
    )
    const [scheduleRange, setScheduleRange] = useState<{
        startAt: string | undefined, endAt: string | undefined
    } | undefined>()
    const [selectedIlot, setSelectedIlot] = useState<string | undefined>(dailyProduction?.ilot)

    const saveMutation = useMutation<
        FetchResponse<DailyProduction> | undefined,
        Error | FetchError,
        SaveParams
    >((saveParams) => saveDailyProduction(saveParams))

    const deleteMutation = useMutation<
        FetchResponse<DailyProduction> | undefined,
        Error | FetchError,
        DeleteParams
    >(({ id }) => deleteDailyProduction(id), {
        onSuccess: () => {
            router.push("/daily-productions")
        },
        onError: (error) => {
            setError(`Error when deleting the resource: ${error}`)
            console.error(error)
        },
    })

    const handleDelete = () => {
        if (!dailyProduction || !dailyProduction["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteMutation.mutate({ id: dailyProduction["@id"] })
    }

    const handleSubmit = async (values: DailyProduction, { setStatus, setSubmitting, setErrors }: FormikHelpers<DailyProduction>) => {
        if (selectedSchedule) values.weeklySchedule = selectedSchedule
        if (selectedIlot) values.ilot = selectedIlot

        // prevent sending empty string "" when one of quantities is not set
        if (!values.firstChoiceQuantity) values.firstChoiceQuantity = 0
        if (!values.secondChoiceQuantity) values.secondChoiceQuantity = 0

        const isCreation = !values["@id"]
        saveMutation.mutate(
            { values },
            {
                onSuccess: (dailyProduction) => {
                    setStatus({ isValid: true, msg: `Element ${isCreation ? "created" : "updated"}.` })
                    setSubmitting(false)
                    router.push("/daily-productions")
                },
                onError: (error: FetchError | Error) => {
                    // setStatus({ isValid: false, msg: `${(error as FetchError).status}` })
                    if ("fields" in error) {
                        setErrors(error.fields)
                    }
                },
                onSettled: () => { setSubmitting(false) },
            }
        )
    }

    useEffect(() => {
        if (selectedSchedule) {
            // set range to display in form (day)
            if (weeklySchedules && weeklySchedules.length > 0) {
                const schedule = weeklySchedules
                    .find((schedule) => schedule["@id"] === selectedSchedule)

                if (schedule) {
                    setScheduleRange(prevState => ({
                        startAt: schedule.startAt,
                        endAt: schedule.endAt
                    }))
                    setSelectedIlot(schedule.ilot?.["@id"])
                }
            }
        } else {
            setScheduleRange(undefined)
            setSelectedIlot(undefined)
        }
    }, [selectedSchedule])

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/daily-productions"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {`< Back to list`}
            </Link>
            <h1 className="sm:text-2xl my-2">
                {dailyProduction
                    ? `Edit Daily Production ${dailyProduction.id}`
                    : `Create Daily Production`}
            </h1>
            <Formik
                initialValues={
                    dailyProduction
                        ? {
                            ...dailyProduction,
                        }
                        : new DailyProduction()
                }
                validate={(values) => {
                    const errors: Partial<DailyProduction> = {}
                    if (!selectedSchedule) {
                        errors.weeklySchedule = 'Weekly Schedule is required.'
                    }
                    if (!selectedIlot) {
                        errors.ilot = 'Ilot is required.'
                    }
                    if (!values?.day) {
                        errors.day = 'Day is required'
                    }

                    // day range validation
                    const startAt = new Date(scheduleRange?.startAt || "")
                    const endAt = new Date(scheduleRange?.endAt || "")
                    const selectedDate = new Date(values.day || "")
                    if (selectedDate < startAt || selectedDate > endAt) {
                        errors.day = `
                            This date must be between ${startAt.toLocaleDateString()} 
                            and ${endAt.toLocaleDateString()} of selected Schedule.
                        `
                    }

                    // day must be unique in selected schedule range (startAt and endAt) 
                    const exist = dailyProductions?.find((production) => (
                        (selectedDate.toLocaleDateString() === new Date(production.day || "").toLocaleDateString()) // compare dates
                        && ((production.weeklySchedule as WeeklySchedule)["@id"] === selectedSchedule)) // only check for current selected schedule
                        && (production["@id"] !== dailyProduction?.["@id"]) // escape current production (for Edit)
                    )

                    if (exist) {
                        errors.day = 'date already allocated'
                    }

                    if (!values.firstChoiceQuantity && !values.secondChoiceQuantity) {
                        // @ts-ignore
                        errors.firstChoiceQuantity = 'You must provide one of quantities [firstChoiceQuantity, secondChoiceQuantity]'
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
                    <form className="shadow-md p-4" onSubmit={handleSubmit} >
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="dailyproduction_weeklySchedule"
                            >
                                Weekly Schedule
                            </label>
                            <Field name="weeklySchedule"
                                as={SelectManyToOne ?? ""}
                                reference="/api/weekly_schedules"
                                optionText="id"
                                value={selectedSchedule ?? ""}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedSchedule(e.target.value)
                                }}
                            />
                            <ErrorMessage name="weeklySchedule"
                                className="text-xs text-red-500 pt-1"
                                component="div"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="dailyproduction_ilot"
                            >
                                Ilot
                            </label>
                            <Field name="ilot"
                                as={SelectManyToOne}
                                reference="/api/ilots"
                                optionText="name"
                                value={selectedIlot ?? ""}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedIlot(e.target.value)
                                }}
                            />
                            <ErrorMessage name="ilot"
                                className="text-xs text-red-500 pt-1"
                                component="div"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm"
                                htmlFor="dailyproduction_day"
                            >
                                <span className="font-bold">Day: </span>{
                                    scheduleRange
                                        ? <span className="font-mono text-sm text-gray-500">
                                            {`start: ${new Date(scheduleRange.startAt || "").toLocaleDateString()}, end: ${new Date(scheduleRange.endAt || "").toLocaleDateString()}`}
                                        </span>
                                        : <></>
                                }
                            </label>
                            <Field
                                name="day"
                                id="dailyproduction_day"
                                value={selectedDay || ""}
                                type="date"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.day && touched.day
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                aria-invalid={
                                    errors.day && touched.day
                                        ? "true"
                                        : undefined
                                }
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    handleChange(e)
                                    setSelectedDay(e.target.value)
                                }}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="day"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="dailyproduction_firstChoiceQuantity"
                            >
                                First Choice Quantity
                            </label>
                            <Field
                                name="firstChoiceQuantity"
                                id="dailyproduction_firstChoiceQuantity"
                                value={values.firstChoiceQuantity ?? ""}
                                type="number"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.firstChoiceQuantity && touched.firstChoiceQuantity
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                aria-invalid={
                                    errors.firstChoiceQuantity && touched.firstChoiceQuantity
                                        ? "true"
                                        : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="firstChoiceQuantity"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="text-gray-700 block text-sm font-bold"
                                htmlFor="dailyproduction_secondChoiceQuantity"
                            >
                                Second Choice Quantity
                            </label>
                            <Field
                                name="secondChoiceQuantity"
                                id="dailyproduction_secondChoiceQuantity"
                                value={values.secondChoiceQuantity ?? ""}
                                type="number"
                                placeholder=""
                                className={`mt-1 block w-full ${errors.secondChoiceQuantity && touched.secondChoiceQuantity
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                aria-invalid={
                                    errors.secondChoiceQuantity && touched.secondChoiceQuantity
                                        ? "true"
                                        : undefined
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage
                                className="text-xs text-red-500 pt-1"
                                component="div"
                                name="secondChoiceQuantity"
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
                {dailyProduction && (
                    <button
                        className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}
