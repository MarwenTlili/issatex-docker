import { FunctionComponent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import { fetch, getItemPath } from "../../utils/dataAccess"
import { DailyProduction } from "../../types/DailyProduction"
import { Ilot } from "../../types/Ilot"
import { WeeklySchedule } from "../../types/WeeklySchedule"
import { Size } from "../../types/Size"
import { Choice } from "../../types/Choice"
import { DailyProductionQuantity } from "../../types/DailyProductionQuantity"

interface Props {
    dailyproduction: DailyProduction
    text: string
    sizes?: Size[]
    choices?: Choice[]
}

export const Show: FunctionComponent<Props> = ({ dailyproduction, text, sizes, choices }) => {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleDelete = async () => {
        if (!dailyproduction["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return

        try {
            await fetch(dailyproduction["@id"], { method: "DELETE" })
            router.push("/daily-productions")
        } catch (error) {
            setError("Error when deleting the resource.")
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <Link
                href="/daily-productions"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>
            <h1 className="font-sans my-2">
                {`Show Daily Production: ${dailyproduction.id}`}
            </h1>
            <div className="flex flex-col space-y-4 mb-4 sm:shadow-md sm:p-4">
                <div className="flex-wrap sm:flex">
                    <p className="text-1xl font-sans font-bold mr-2">Weekly Schedule:</p>
                    <span className="text-1xl font-sans text-gray-700">
                        {(dailyproduction.weeklySchedule as WeeklySchedule).id}
                    </span>
                </div>
                <div className="flex">
                    <p className="text-1xl font-sans font-bold mr-2">Ilot:</p>
                    <span className="text-1xl font-sans text-gray-700">
                        {((dailyproduction.weeklySchedule as WeeklySchedule).ilot as Ilot).name}
                    </span>
                </div>

                <div className="flex">
                    <p className="text-1xl font-sans font-bold mr-2">Date:</p>
                    <span className="text-1xl font-sans text-gray-700">
                        {new Date(dailyproduction.day || "").toLocaleDateString()}
                    </span>
                </div>
                <div className="flex-col">
                    <p className="text-1xl font-sans font-bold mr-2">Quantities:</p>
                    <table className="table border-separate border border-slate-400 w-full">
                        <thead>
                            <tr>
                                <th className={`text-sm font-sans border border-slate-300 px-4 py-2 w-24`}>Size\Choice</th>
                                {choices?.map(choice =>
                                    <th key={choice["@id"]} className={`text-sm font-sans border border-slate-300 bg-gray-300 sm:px-4 sm:py-2`}>{choice.name}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sizes?.map((size, sizeIndex) => (
                                <tr key={sizeIndex} className="h-12">
                                    <td className={`text-sm font-sans font-bold border border-slate-300 bg-gray-300 px-2 py-2`}>{size.name}</td>
                                    {choices?.map((choice, choiceIndex) => {
                                        const dailyProductionQuantities = dailyproduction.dailyProductionQuantities as DailyProductionQuantity[]
                                        const q = dailyProductionQuantities.find(qty => {
                                            const DailyProductionQuantityObject = qty as DailyProductionQuantity
                                            return (DailyProductionQuantityObject.size as Size)["@id"] === size['@id']
                                                && (DailyProductionQuantityObject.choice as Choice)["@id"] === choice['@id']
                                        });
                                        if (dailyProductionQuantities && q && typeof q === 'object') {
                                            const index = dailyProductionQuantities.indexOf(q)
                                            return (
                                                <td key={`${sizeIndex}-${choiceIndex}`} className={`font-sans border text-center px-4 py-2`}>
                                                    <span>
                                                        {(dailyproduction?.dailyProductionQuantities?.[index] as DailyProductionQuantity).quantity}
                                                    </span>
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-row justify-between">
                    <Link
                        href={getItemPath(
                            dailyproduction["@id"],
                            "/daily-productions/[id]/edit"
                        )}
                        className="flex justify-center items-center bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-sans font-bold rounded w-20 h-10 "
                    >
                        Edit
                    </Link>
                    <button
                        className="inline-block text-sm text-red-400 font-sans font-bold border-2 border-red-400 rounded w-20 h-10 hover:border-red-700 hover:text-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {error && (
                <div
                    className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                    role="alert"
                >
                    {error}
                </div>
            )}
        </div>
    )
}
