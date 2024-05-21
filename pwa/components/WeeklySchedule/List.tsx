import { Dispatch, FunctionComponent, SetStateAction } from "react"

import { WeeklySchedule } from "../../types/WeeklySchedule"
import { Article } from "../../types/Article"
import { getItemPath } from "../../utils/dataAccess"
import { ManufacturingOrder } from "../../types/ManufacturingOrder"
import Link from "next/link"

export const SCHEDULES_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

export const List: FunctionComponent<Props> = ({ weeklyschedules, totalItems, perPage, setPerPage }) => {
    return (
        <div className="container p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl mb-2">Weekly Schedules</h1>
            </div>
            <div className="block sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Weekly Schedules {weeklyschedules.length} / {totalItems}</p>
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
                        {SCHEDULES_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            <ul className="my-4">
                {weeklyschedules &&
                    weeklyschedules.length != 0 &&
                    weeklyschedules.map((weeklyschedule) => (
                        <li key={weeklyschedule.id}
                            className="w-full border-b-2 my-4 rounded-md odd:bg-white even:bg-gray-50"
                        >
                            <div className="my-2 sm:flex sm:flex-row sm:justify-between">
                                <div className="">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="flex-shrink-0 mr-2 font-sans md:flex-shrink">Schedule </div>
                                        <Link
                                            href={getItemPath(weeklyschedule["@id"], "/weekly-schedules/[id]")}
                                            className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                        >
                                            {weeklyschedule.id}
                                        </Link>
                                    </div>

                                    <div className="flex flex-col sm:flex-row">
                                        <div className="font-sans">
                                            From: <span className="prose">{new Date(weeklyschedule.startAt || '').toLocaleDateString()}</span>
                                        </div>
                                        <div className="font-sans sm:ml-4">
                                            To: <span className="prose">{new Date(weeklyschedule.endAt || '').toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="font-sans">
                                        Islet:
                                        <span className="ml-2 font-sans prose">
                                            {weeklyschedule.islet?.name}
                                        </span>
                                    </div>
                                    <div className="font-sans">
                                        Order:
                                        <Link
                                            href={getItemPath(weeklyschedule.manufacturingOrder?.["@id"], "/manufacturing-orders/[id]")}
                                            className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                        >
                                            <span className="ml-2 font-sans">
                                                {weeklyschedule.manufacturingOrder && (
                                                    weeklyschedule.manufacturingOrder.id
                                                )}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="font-sans">
                                        Article:
                                        <Link
                                            href={getItemPath((weeklyschedule.manufacturingOrder?.article as Article)?.["@id"], "/articles/[id]")}
                                            className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                        >
                                            <span className="ml-2 font-sans">
                                                {weeklyschedule.manufacturingOrder && (
                                                    ((weeklyschedule.manufacturingOrder as ManufacturingOrder).article as Article)?.designation
                                                )}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="font-sans">
                                        Production (days):
                                        <span className="ml-2 font-sans prose">
                                            {weeklyschedule.dailyProductions?.length}
                                        </span>
                                    </div>
                                    <div className="font-sans">
                                        Observation:
                                        <p className='max-w-full line-clamp-1 font-sans prose'
                                            dangerouslySetInnerHTML={{ __html: weeklyschedule.observation ?? "" }}
                                        />
                                    </div>
                                </div>

                                <div className=" my-2 py-1">
                                    <Link
                                        href={{
                                            pathname: "/daily-productions/create",
                                            query: { weeklySchedule: weeklyschedule["@id"] }
                                        }}
                                        className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded whitespace-nowrap"
                                    >
                                        Add production
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

interface Props {
    weeklyschedules: WeeklySchedule[]
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
}
