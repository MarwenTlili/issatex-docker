import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useState
} from "react";
import Link from "next/link";

import { fetch, getItemPath } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import { useRouter } from "next/router";
import { Session } from "next-auth";

export const EMPLOYEES_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

interface Props {
    employees: Employee[];
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
    session: Session | null
}

export const List: FunctionComponent<Props> = ({ employees, totalItems, perPage, setPerPage, session }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (employee: Employee) => {
        if (!employee["@id"]) return;
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await fetch(employee["@id"], { method: "DELETE" });
            router.push("/employees");
        } catch (error) {
            setError("Error when deleting the resource.");
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl mb-2">Employee List</h1>
                <Link
                    href="/employees/create"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
                >
                    Create
                </Link>
            </div>

            <div className="block sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Employees {employees.length} / {totalItems}</p>
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
                        {EMPLOYEES_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            <div className="container mx-auto p-4">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees &&
                        employees.length != 0 &&
                        employees.map((employee, id) =>
                            <li key={employee.id} className="bg-white p-4 shadow rounded-md">
                                <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                                    <Link
                                        href={getItemPath(employee["@id"], "/employees/[id]")}
                                        className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                    >
                                        {`${employee.firstName} ${employee.lastName}`}
                                    </Link>
                                </h5>
                                <p>
                                    <span>Registration Code: </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {employee.registrationCode}
                                    </span>
                                </p>
                                <p>
                                    <span>Category: </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {employee.category}
                                    </span>
                                </p>
                                <p>
                                    <span>recruitmentAt: </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {new Date(employee.recruitmentAt || '').toLocaleDateString()}
                                    </span>
                                </p>
                                <Link
                                    href={getItemPath(employee["@id"], "/employees/[id]/edit")}
                                    className="font-mono text-lg text-orange-800/100 hover:text-indigo-800 ml-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="font-mono text-lg text-red-400/100 hover:text-red-400 ml-2"
                                    onClick={() => handleDelete(employee)}
                                >
                                    Delete
                                </button>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
};
