import { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import Link from "next/link"

import { IsletEmployeeAttendance } from "../../types/IsletEmployeeAttendance"
import { Employee } from "../../types/Employee"
import { Islet } from "../../types/Islet"
import { Attendance } from "../../types/Attendance"
import { fetch, getItemPath, FetchError, FetchResponse } from "../../utils/dataAccess"
import { useRouter } from "next/router"
import { useMutation } from "react-query"
import { getTimeFromISODateTime } from "../../utils/tools"
import { Session } from "next-auth"

export const EMPLOYEE_ATTENDANCE_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

interface Props {
    isletEmployeeAttendances: IsletEmployeeAttendance[]
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
    session: Session | null
}

interface DeleteParams {
    id: string
}

const deleteIsletEmployeeAttendance = async (id: string) =>
    await fetch<IsletEmployeeAttendance>(id, { method: "DELETE" })

export const List: FunctionComponent<Props> = ({
    isletEmployeeAttendances, totalItems, perPage, setPerPage
}) => {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

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

    const handleDelete = (isletEmployeeAttendance: IsletEmployeeAttendance) => {
        if (!isletEmployeeAttendance || !isletEmployeeAttendance["@id"]) return
        if (!window.confirm("Are you sure you want to delete this item?")) return
        deleteMutation.mutate({ id: isletEmployeeAttendance["@id"] })
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl mb-2">Attendance List</h1>
                <Link
                    href="/islet-employee-attendances/create"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
                >
                    Create
                </Link>
            </div>

            <div className="block mb-4 sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Employees Attendances {isletEmployeeAttendances.length} / {totalItems}</p>
                <p className="pt-2">
                    <span>items per page</span>
                    <select name="perPage" id="perPage"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1 ml-1 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        value={perPage}
                        onChange={(event) => {
                            if (event.target.value) {
                                setPerPage(event.target.value)
                                router.push("/islet-employee-attendances")
                            }
                        }}>
                        {EMPLOYEE_ATTENDANCE_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            <div className="border border-gray-100 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isletEmployeeAttendances &&
                    isletEmployeeAttendances.length != 0 &&
                    isletEmployeeAttendances.map((isletEmployeeAttendance) => (
                        <div key={isletEmployeeAttendance["@id"]}
                            className="border p-2"
                        >
                            <div className="flex flex-col md:flex-row">
                                <strong className="hidden md:inline">ID: </strong>
                                {/* <Link href={getItemPath(isletEmployeeAttendance["@id"], "islet-employee-attendances/[id]")}
                                    className="font-mono text-cyan-600/100 md:ml-2 hover:text-indigo-800"
                                >
                                    {isletEmployeeAttendance.id}
                                </Link> */}
                                <div className="font-mono text-cyan-600/100 md:ml-2 hover:text-indigo-800">
                                    {isletEmployeeAttendance.id}
                                </div>
                            </div>

                            <div>
                                <strong>Employee:</strong>
                                <span className="ml-2">
                                    {(isletEmployeeAttendance.employee as Employee)?.firstName} -
                                    {(isletEmployeeAttendance.employee as Employee)?.lastName}
                                </span>
                            </div>

                            <div>
                                <strong>Islet:</strong>
                                <span className="ml-2">
                                    {(isletEmployeeAttendance.islet as Islet)?.name}
                                </span>
                            </div>

                            <div>
                                <strong>Day:</strong>
                                <span className="ml-2">
                                    {new Date((isletEmployeeAttendance.attendance as Attendance)?.dateAt || '').toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <strong>Start At:</strong>
                                    <span className="ml-2">
                                        {getTimeFromISODateTime((isletEmployeeAttendance.attendance as Attendance)?.startAt || '')}
                                    </span>
                                </div>

                                <div>
                                    <strong>End At:</strong>
                                    <span className="ml-2">
                                        {getTimeFromISODateTime((isletEmployeeAttendance.attendance as Attendance)?.endAt || '')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-row justify-between">
                                <Link className="font-mono text-lg text-orange-800/100 hover:text-indigo-800"
                                    href={getItemPath(isletEmployeeAttendance["@id"], "/islet-employee-attendances/[id]/edit")}
                                >
                                    Edit
                                </Link>
                                <button className="font-mono text-lg text-red-400/100 hover:text-red-400"
                                    onClick={() => handleDelete(isletEmployeeAttendance)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
