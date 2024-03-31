import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { fetch, getItemPath } from "../../utils/dataAccess";
import { Employee } from "../../types/Employee";
import { Session } from "next-auth";

interface Props {
    employee: Employee;
    text: string;
    session: Session | null;
}

export const Show: FunctionComponent<Props> = ({ employee, text, session }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
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
        <div className="container mx-auto px-4 max-w-2xl mt-4 mb-4">
            <Link
                href="/employees"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>
            <h1 className="text-1xl mb-2">{`Show Employee ${employee["id"]}`}</h1>
            <table
                cellPadding={10}
                className="w-full shadow-md table border-collapse leading-normal table-auto text-left my-3"
            >
                <thead className="text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200">
                    <tr>
                        <th scope="row">firstName</th>
                        <td>{employee.firstName}</td>
                    </tr>
                    <tr>
                        <th scope="row">lastName</th>
                        <td>{employee.lastName}</td>
                    </tr>
                    <tr>
                        <th scope="row">registrationCode</th>
                        <td>{employee.registrationCode}</td>
                    </tr>
                    <tr>
                        <th scope="row">category</th>
                        <td>{employee.category}</td>
                    </tr>
                    <tr>
                        <th scope="row">recruitmentAt</th>
                        <td>{new Date(employee.recruitmentAt || '').toLocaleDateString()}</td>
                    </tr>
                </tbody>
            </table>
            {error && (
                <div
                    className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                    role="alert"
                >
                    {error}
                </div>
            )}
            <div className="flex flex-row justify-between">
                <Link
                    href={getItemPath(employee["@id"], "/employees/[id]/edit")}
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
    );
};
