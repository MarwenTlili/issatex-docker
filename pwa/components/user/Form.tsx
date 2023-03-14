import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { User } from "../../types/User";

interface Props {
	user?: User;
}

interface SaveParams {
	values: User;
}

interface DeleteParams {
	id: string;
}

const saveUser = async ({ values }: SaveParams) =>
	await fetch<User>(!values["@id"] ? "/api/users" : values["@id"], {
		method: !values["@id"] ? "POST" : "PUT",
		body: JSON.stringify(values),
	}
);

const deleteUser = async (id: string) =>
	await fetch<User>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ user }) => {
	const [, setError] = useState<string | null>(null);
	const router = useRouter();

	const saveMutation = useMutation<
		FetchResponse<User> | undefined,
		Error | FetchError,
		SaveParams
	>((saveParams) => saveUser(saveParams));

	const deleteMutation = useMutation<
		FetchResponse<User> | undefined,
		Error | FetchError,
		DeleteParams
	>(({ id }) => deleteUser(id), {
		onSuccess: () => {
			router.push("/users");
		},
		onError: (error) => {
			setError(`Error when deleting the resource: ${error}`);
			console.error(error);
		},
	});

	const handleDelete = () => {
		if (!user || !user["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;
		deleteMutation.mutate({ id: user["@id"] });
	};

	return (
		<div className="container mx-auto px-4 max-w-2xl mt-4">
			<Link
				href="/users"
				className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
			>
				{`< Back to list`}
			</Link>
			<h1 className="text-3xl my-2">
				{user ? `Edit User ${user["@id"]}` : `Create User`}
			</h1>
			<Formik
				initialValues={ user ?{...user,} :new User() }
				validate={() => {
					const errors = {};
					// add your validation logic here
					return errors;
				}}
				onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
					const isCreation = !values["@id"];
					saveMutation.mutate(
						{ values },
						{
							onSuccess: () => {
								setStatus({
									isValid: true,
									msg: `Element ${isCreation ? "created" : "updated"}.`,
								});
								router.	push("/api/users");
							},
							onError: (error) => {
								setStatus({
									isValid: false,
									msg: `${error.message}`,
								});
								if ("fields" in error) {
									setErrors(error.fields);
								}
							},
							onSettled: () => {
								setSubmitting(false);
							},
						}
					);
				}}
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
					<form className="shadow-md p-4" onSubmit={handleSubmit}>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_email"
							>
								email
							</label>
							<input
								name="email"
								id="user_email"
								value={values.email ?? ""}
								type="text"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.email && touched.email ? "border-red-500" : ""
								}`}
								aria-invalid={
									errors.email && touched.email ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="email"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_username"
							>
								username
							</label>
							<input
								name="username"
								id="user_username"
								value={values.username ?? ""}
								type="text"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.username && touched.username ? "border-red-500" : ""
								}`}
								aria-invalid={
									errors.username && touched.username ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="username"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_roles"
							>
								roles
							</label>
							<input
								name="roles"
								id="user_roles"
								value={values.roles ?? ""}
								type="text"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.roles && touched.roles ? "border-red-500" : ""
								}`}
								aria-invalid={
									errors.roles && touched.roles ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="roles"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_avatar"
							>
								avatar
							</label>
							<input
								name="avatar"
								id="user_avatar"
								value={values.avatar ?? ""}
								type="text"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.avatar && touched.avatar ? "border-red-500" : ""
								}`}
								aria-invalid={
									errors.avatar && touched.avatar ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="avatar"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_plainPassword"
							>
								plainPassword
							</label>
							<input
								name="plainPassword"
								id="user_plainPassword"
								value={values.plainPassword ?? ""}
								type="text"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.plainPassword && touched.plainPassword
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.plainPassword && touched.plainPassword
									? "true"
									: undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="plainPassword"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_createdAt"
							>
								createdAt
							</label>
							<input
								name="createdAt"
								id="user_createdAt"
								value={values.createdAt?.toLocaleString() ?? ""}
								type="dateTime"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.createdAt && touched.createdAt ? "border-red-500" : ""
								}`}
								aria-invalid={
									errors.createdAt && touched.createdAt ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="createdAt"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_lastLoginAt"
							>
								lastLoginAt
							</label>
							<input
								name="lastLoginAt"
								id="user_lastLoginAt"
								value={values.lastLoginAt?.toLocaleString() ?? ""}
								type="dateTime"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.lastLoginAt && touched.lastLoginAt
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.lastLoginAt && touched.lastLoginAt ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="lastLoginAt"
							/>
						</div>
						<div className="mb-2">
							<label
								className="text-gray-700 block text-sm font-bold"
								htmlFor="user_isVerified"
							>
								isVerified
							</label>
							<input
								name="isVerified"
								id="user_isVerified"
								value={values.isVerified ?? ""}
								type="checkbox"
								placeholder=""
								className={`mt-1 block w-full ${
									errors.isVerified && touched.isVerified
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.isVerified && touched.isVerified ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="isVerified"
							/>
						</div>
						{status && status.msg && (
							<div
								className={`border px-4 py-3 my-4 rounded ${
									status.isValid
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
				{user && (
					<button
						className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
						onClick={handleDelete}
					>
						Delete
					</button>
				)}
			</div>
		</div>
	);
};
