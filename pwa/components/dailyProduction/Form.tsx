import { ChangeEvent, FunctionComponent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik"
import { useMutation } from "react-query"

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess"
import SelectManyToOne from "../formik/SelectManyToOne"
import { DailyProduction } from "../../types/DailyProduction"
import { WeeklySchedule } from "../../types/WeeklySchedule"
import { Size } from "../../types/Size"
import { Choice } from "../../types/Choice"
import { DailyProductionQuantity } from "../../types/DailyProductionQuantity"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import { ManufacturingOrderSize } from "../../types/ManufacturingOrderSize"

export const Form: FunctionComponent<Props> = ({
    dailyProduction,
    weeklySchedules,
    dailyProductions,
    weeklySchedule,
    sizes,
    choices
}) => {
    const [, setError] = useState<string | null>(null)
    const router = useRouter()
    const [selectedDay, setSelectedDay] = useState<string>(dailyProduction?.day?.split('T')[0] || "")
    const [selectedSchedule, setSelectedSchedule] = useState<string | undefined>(
        (dailyProduction?.weeklySchedule as string) || weeklySchedule
    )
    const [scheduleRange, setScheduleRange] = useState<{
        startAt: string | undefined, endAt: string | undefined
    } | undefined>()

    const [dailyProductionQuantities, setDailyProductionQuantities] = useState<DailyProductionQuantity[]>(
        (dailyProduction?.dailyProductionQuantities as DailyProductionQuantity[])
            ? dailyProduction?.dailyProductionQuantities as DailyProductionQuantity[]
            : []
    )
    const isCreation = !dailyProduction
    const [order, setOrder] = useState<ManufacturingOrder>()

    useState(() => {
        // initialize all quantities to 0 if form is in creation mode
        if (isCreation) {
            const initialQuantities: DailyProductionQuantity[] = [];
            sizes?.forEach(size => {
                choices?.forEach(choice => {
                    initialQuantities.push(new DailyProductionQuantity(undefined, 0, size["@id"], choice["@id"]));
                });
            });
            setDailyProductionQuantities(initialQuantities);
        }
    });

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

    const saveMutaionDailyProductionQuantity = useMutation<
        FetchResponse<DailyProductionQuantity> | undefined,
        Error | FetchError,
        DailyProductionQuantityParams
    >((saveParams) => saveDailyProductionQuantity(saveParams))

    const handleQuantityChange = (index: number, value: number) => {
        const newQuantities: DailyProductionQuantity[] = [...dailyProductionQuantities];
        if (newQuantities[index]) newQuantities[index].quantity = value;
        setDailyProductionQuantities(newQuantities);
    };

    const saveDailyProductionQuantities = async (dailyProductionQuantities: DailyProductionQuantity[]) => {
        const savedIds = []; // Array to store saved IDs

        // Iterate through each daily production quantity and initiate save operation
        for (const dailyProductionQuantity of dailyProductionQuantities) {
            try {
                // Call the save mutation
                const response = await saveMutaionDailyProductionQuantity.mutateAsync(
                    { dailyProductionQuantity: dailyProductionQuantity }
                );
                if (response?.data["@id"]) {
                    savedIds.push(response?.data["@id"]); // Push saved ID to the array
                }
            } catch (error) {
                // Handle errors if needed
                console.error("Error saving daily production quantity:", error);
                throw error; // Rethrow the error if needed
            }
        }

        return savedIds; // Return array of saved IDs (only in creation mode)
    };

    const handleSubmit = async (values: DailyProduction, { setStatus, setSubmitting, setErrors }: FormikHelpers<DailyProduction>) => {
        if (selectedSchedule) values.weeklySchedule = selectedSchedule

        const dailyProductionQuantitiesFormatted = dailyProductionQuantities.map(q => {
            if (typeof q.choice === 'object') q.choice = (q.choice as Choice)["@id"]
            if (typeof q.size === 'object') q.size = (q.size as Size)["@id"]
            return q
        })
        values.dailyProductionQuantities = dailyProductionQuantitiesFormatted

        const isCreation = !values["@id"]
        saveDailyProductionQuantities(dailyProductionQuantities).then(savedQuantities => {
            values.dailyProductionQuantities = savedQuantities
            saveMutation.mutate(
                { values },
                {
                    onSuccess: (dailyProduction) => {
                        setStatus({ isValid: true, msg: `Production ${isCreation ? "created" : "updated"}.` })
                        setSubmitting(false)
                        router.push("/daily-productions")
                    },
                    onError: (error: FetchError | Error) => {
                        if ("fields" in error) {
                            setErrors(error.fields)
                        }
                    },
                    onSettled: () => { setSubmitting(false) },
                }
            )
        })

    }

    useEffect(() => {
        // set range to display in form (day field)
        if (selectedSchedule) {
            const schedule = weeklySchedules?.find((schedule) => schedule["@id"] === selectedSchedule)
            if (schedule) {
                setScheduleRange(prevState => ({
                    startAt: schedule.startAt,
                    endAt: schedule.endAt
                }))
            }
            setOrder(schedule?.manufacturingOrder as ManufacturingOrder)
        } else {
            setScheduleRange(undefined)
        }
    }, [selectedSchedule, weeklySchedules])

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/daily-productions"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {`< Back to list`}
            </Link>
            <h1 className="sm:text-1xl font-sans my-2">
                {dailyProduction
                    ? `Edit Daily Production: ${dailyProduction.id}`
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
                    <form className="mb-4 sm:shadow-md sm:p-4 flex flex-col space-y-4" onSubmit={handleSubmit} >
                        <div>
                            <label
                                className="text-1xl font-sans font-bold mr-2"
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
                        <div>
                            <label
                                className="text-1xl font-sans font-bold mr-2"
                                htmlFor="dailyproduction_day"
                            >
                                Day:
                            </label>
                            {scheduleRange
                                ? <span className="font-mono text-sm text-gray-500">
                                    {`start: ${new Date(scheduleRange.startAt || "").toLocaleDateString()}, end: ${new Date(scheduleRange.endAt || "").toLocaleDateString()}`}
                                </span>
                                : <></>
                            }
                            <Field
                                name="day"
                                id="dailyproduction_day"
                                value={selectedDay || ""}
                                type="date"
                                placeholder=""
                                className={`mt-1 block w-48 ${errors.day && touched.day
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
                        {order?.manufacturingOrderSizes && (
                            <div >
                                <label htmlFor="dailyproduction_weeklySchedule_Order"
                                    className="text-1xl font-sans font-bold mr-2" >
                                    Manufacturing Order
                                </label>
                                <ul>
                                    {(order.manufacturingOrderSizes as ManufacturingOrderSize[]).map((orderSize, index) =>
                                        <li key={index} className="font-mono text-sm text-gray-500 ml-4">
                                            {(orderSize.size as Size).name}: {orderSize.quantity}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )
                        }
                        <div>
                            <label
                                className="text-1xl font-sans font-bold mr-2"
                                htmlFor="dailyproduction_dailyProductionQuantity"
                            >
                                Quantities
                            </label>
                            <table className="table border-separate border border-slate-400 w-full">
                                <thead>
                                    <tr className="">
                                        <th className="text-sm font-sans border border-slate-300 w-24 px-4 py-2">Size\Choice</th>
                                        {choices?.map(choice =>
                                            <th key={choice["@id"]} className="text-sm font-sans border border-slate-300 bg-gray-300 sm:px-4 sm:py-2">{choice.name}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizes?.map((size, sizeIndex) => (
                                        <tr key={sizeIndex} className="h-12">
                                            <td className="text-sm font-sans font-bold border border-slate-300 bg-gray-300 px-2 py-2">{size.name}</td>
                                            {choices?.map((choice, choiceIndex) => {
                                                const q = dailyProductionQuantities?.find(qty => {
                                                    const DailyProductionQuantityObject = qty as DailyProductionQuantity
                                                    return (DailyProductionQuantityObject.size as Size)["@id"] === size['@id']
                                                        && (DailyProductionQuantityObject.choice as Choice)["@id"] === choice['@id']
                                                });
                                                const index = isCreation
                                                    ? (sizeIndex * choices.length + choiceIndex)
                                                    : dailyProductionQuantities.indexOf(q as DailyProductionQuantity)
                                                return (
                                                    <td key={`${sizeIndex}-${choiceIndex}`} className="font-sans border">
                                                        <Field
                                                            className="w-full"
                                                            name={`dailyProductionQuantities.${q ? index + '.quantity' : ''}`}
                                                            type="number"
                                                            min="0"
                                                            value={dailyProductionQuantities[index] ? dailyProductionQuantities[index].quantity : ""}
                                                            onChange={(e: { target: { value: string } }) => handleQuantityChange(index, parseInt(e.target.value))}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <button
                                type="submit"
                                className="inline-block bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold rounded w-20 h-10"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>

                            <div className="">
                                {dailyProduction && (
                                    <button
                                        className="inline-block text-sm text-red-400 font-sans font-bold border-2 border-red-400 rounded w-20 h-10 hover:border-red-700 hover:text-red-700"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
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
                )}
            </Formik>
        </div>
    )
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

const saveDailyProductionQuantity = async ({ dailyProductionQuantity }: DailyProductionQuantityParams) =>
    await fetch<DailyProductionQuantity>(
        !dailyProductionQuantity["@id"] ? "/api/daily_production_quantities" : dailyProductionQuantity["@id"],
        {
            method: !dailyProductionQuantity["@id"] ? "POST" : "PUT",
            body: JSON.stringify(dailyProductionQuantity),
        }
    )

const deleteDailyProductionQuantity = async (id: string) =>
    await fetch<DailyProductionQuantity>(id, { method: "DELETE" })

interface Props {
    dailyProduction?: DailyProduction
    weeklySchedules?: WeeklySchedule[] | undefined
    dailyProductions?: DailyProduction[] | undefined
    weeklySchedule?: string
    sizes?: Size[]
    choices?: Choice[]
}

interface SaveParams {
    values: DailyProduction
}

interface DeleteParams {
    id: string
}

interface DailyProductionQuantityParams {
    dailyProductionQuantity: DailyProductionQuantity
}
