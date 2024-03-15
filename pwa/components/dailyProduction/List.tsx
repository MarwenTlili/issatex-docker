import { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import Link from "next/link";

import { fetch, getItemPath } from "../../utils/dataAccess";
import { DailyProduction } from "../../types/DailyProduction";
import { WeeklySchedule } from "../../types/WeeklySchedule";
import { Ilot } from "../../types/Ilot";
import { useRouter } from "next/router";

export const DAILYPRODUCTION_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

interface Props {
    dailyproductions: DailyProduction[]
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
}

export const List: FunctionComponent<Props> = ({ dailyproductions, totalItems, perPage, setPerPage }) => {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleDelete = async (dailyproduction: DailyProduction) => {
        if (!dailyproduction["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return

        try {
            await fetch<DailyProduction>(dailyproduction["@id"], { method: "DELETE" })
            router.reload()
        } catch (error) {
            setError("Error when deleting the DailyProduction.")
            console.error(error)
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl mb-2">Daily Productions</h1>
                <Link
                    href="/daily-productions/create"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
                >
                    Create
                </Link>
            </div>

            <div className="block sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Productions {dailyproductions.length} / {totalItems}</p>
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
                        {DAILYPRODUCTION_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            <ul className="container mx-auto p-2">
                {dailyproductions &&
                    dailyproductions.length != 0 &&
                    dailyproductions.map((dailyproduction) => (
                        <li key={dailyproduction["@id"]} className="w-full border-b-2 p-2 my-4 rounded-md odd:bg-white even:bg-gray-50">
                            <div className="md:flex md:flex-row md:space-x-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="mr-2 font-sans">Prodction:</div>
                                        <Link href={getItemPath(dailyproduction["@id"], "/daily-productions/[id]")}
                                            className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                        >
                                            {dailyproduction.id}
                                        </Link>
                                    </div>
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="mr-2 font-sans">Schedule:</div>
                                        <span className="font-sans prose">
                                            {(dailyproduction.weeklySchedule as WeeklySchedule).id}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center font-sans">
                                        <div className="mr-2 font-sans">Ilot:</div>
                                        <span className="font-sans prose">
                                            {((dailyproduction.weeklySchedule as WeeklySchedule).ilot as Ilot).name}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-row items-center font-sans">
                                        <div className="mr-2 font-sans">Day:</div>
                                        <span className="font-sans prose">
                                            {new Date(dailyproduction.day || "").toLocaleDateString()}
                                        </span>
                                    </div>
                                    {/* <div className="flex flex-row items-center font-sans">
                                        <div className="mr-2 font-sans">Quantities:</div>
                                        <span className="font-sans prose">
                                            {`first: ${dailyproduction.firstChoiceQuantity}, seconde: ${dailyproduction.secondChoiceQuantity}`}
                                        </span>
                                    </div> */}
                                </div>
                                <div className="flex justify-end md:flex-col md:justify-start">
                                    <Link
                                        href={getItemPath(dailyproduction["@id"], "/daily-productions/[id]/edit")}
                                        className="font-mono text-lg text-orange-800/100 hover:text-indigo-800 mr-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="font-mono text-lg text-red-400/100 hover:text-red-400 mr-2"
                                        onClick={() => handleDelete(dailyproduction)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>

        </div>
    )
}
