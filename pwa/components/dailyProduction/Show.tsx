import { FunctionComponent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"

import { fetch, getItemPath } from "../../utils/dataAccess"
import { DailyProduction } from "../../types/DailyProduction"
import { Ilot } from "../../types/Ilot"
import { WeeklySchedule } from "../../types/WeeklySchedule"

interface Props {
    dailyproduction: DailyProduction
    text: string
}

export const Show: FunctionComponent<Props> = ({ dailyproduction, text }) => {
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
        <div className="container p-1 sm:p-4">
            <Head>
                <title>{`Show DailyProduction ${dailyproduction["@id"]}`}</title>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </Head>
            <Link
                href="/daily-productions"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>
            <div className="grid grid-cols-1 rounded shadow-xl p-4 m-1 sm:my-4">
                <div className="flex flex-col py-2 sm:items-center sm:flex-row">
                    <div className="font-sans mr-2 md:text-2xl">Day:</div>
                    <p className="font-sans text-gray-500 md:text-2xl">
                        {dailyproduction.id}
                    </p>
                </div>
                <div className="flex flex-col py-2 sm:items-center sm:flex-row">
                    <div className="font-sans mr-2 md:text-2xl">Schedule:</div>
                    <span className="font-sans text-gray-500 md:text-2xl">
                        {(dailyproduction.weeklySchedule as WeeklySchedule).id}
                    </span>
                </div>
                <div className="flex items-center py-2">
                    <div className="font-sans mr-2 md:text-2xl">Ilot:</div>
                    <span className="font-sans text-gray-500 md:text-2xl">
                        {(dailyproduction.ilot as Ilot).name}
                    </span>
                </div>

                <div className="flex items-center py-2">
                    <div className="font-sans mr-2 md:text-2xl">Production Dates:</div>
                    <span className="font-sans text-gray-500 md:text-2xl">
                        {new Date(dailyproduction.day || "").toLocaleDateString()}
                    </span>
                </div>
                <div className="flex items-center">
                    <div className="font-sans mr-2 md:text-2xl">Quantities:</div>
                    <span className="font-sans text-gray-500 md:text-2xl">
                        first: {dailyproduction.firstChoiceQuantity}, second: {dailyproduction.secondChoiceQuantity}
                    </span>
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
            <div className="flex space-x-2 mt-4 items-center justify-end">
                <Link
                    href={getItemPath(
                        dailyproduction["@id"],
                        "/daily-productions/[id]/edit"
                    )}
                    className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded"
                >
                    Edit
                </Link>
                <button
                    className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}
