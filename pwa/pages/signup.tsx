import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { User } from "../types/User";
import { FetchError, FetchResponse, fetch } from "../utils/dataAccess";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useMutation } from "react-query";
import Modal from "../components/Modal";
import * as Yup from "yup";

interface SaveParams {
	values: User;
}

interface CustomUser extends User {
	confirmPassword?: string | undefined;
}

function signup() {
	const user = new User();

	let confirmPassword: string | undefined = undefined;
	let customInitials: CustomUser = { ...user, confirmPassword };

	const [agreeTerms, setAgreeTerms] = useState(false);
	const [showModal, setShowModal] = useState(false);
	
	const { push } = useRouter();

	const UserSchema = Yup.object().shape({
		username: Yup.string().min(4).required(),
		email: Yup.string().email('Invalid email').required(),
		plainPassword: Yup.string().min(6),
		confirmPassword: Yup.string(),
	});

	/** save user using fetch (defined in utils/dataAccess)  */
	const saveUser = async ({ values }: SaveParams) =>
		await fetch<User>(!values["@id"] ? "/api/users" : values["@id"], {
			method: !values["@id"] ? "POST" : "PUT",
			body: JSON.stringify(values),
		});

	const saveMutation = useMutation<
		FetchResponse<User> | undefined, Error | FetchError, SaveParams
	>((saveParams) => saveUser(saveParams));

	const handleSubmit = (customValues: CustomUser, { setStatus, setSubmitting, setErrors }: FormikHelpers<CustomUser>) => {
		const { confirmPassword: _, ...values } = customValues;
		const now = new Date();

		values.roles = ["ROLE_COMPANY"];
		values.createdAt = now;
		values.lastLoginAt = now;
		values.isVerified = false;

		console.log("values: ", values);
		/**
		 * submit user form whith changed vales
		 */
		saveMutation.mutate(
			{ values },
			{
				onSuccess: () => {
					setStatus({
						isValid: true,
						msg: `Profile Signed Up.`,
					});
					push("/auth/signin");
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
		)
	}

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
				style={{ height: "100%" }}
			>
				<a href="#" className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
					<Image
						className="w-12 h-8 mr-2"
						src="/images/tailwind-logo.png"
						alt="logo" width={512} height={512}
					/>
					Sign Up
				</a>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Client Form
						</h1>
						<Formik
							initialValues={customInitials}
							validationSchema={UserSchema}
							validate={(values) => {
								const errors: User = {};
								// validate plainPassword and confirmPassword only if one of them is not empty
								if ((values.plainPassword || values.confirmPassword) && (values.plainPassword != values.confirmPassword)) {
									errors.plainPassword = "passwords does not match!";
								}

								return errors;
							}}
							onSubmit={handleSubmit}
						>
							{({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
								<form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off">
									<div>
										<label
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
											htmlFor="username"
										>
											username
										</label>
										<input
											type="text" name="username" id="user_username" placeholder="your name or company name"
											value={values.username ?? ""}
											className={`bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600  block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ${
												errors.username && touched.username ? "border border-red-500" : "border border-gray-300 focus:border-primary-600 dark:border-gray-600 dark:focus:border-blue-500"
											}`}
											aria-invalid={
												errors.username && touched.username ? "true" : undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
											required={true}
										/>
										<ErrorMessage
											className="text-xs text-red-500 pt-1"
											component="div"
											name="username"
										/>
									</div>

									<div>
										<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your company email</label>
										<input
											type="email" name="email" id="user_email"
											value={values.email ?? ""}
											placeholder="name@company.com"
											className={`bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ${
												errors.email && touched.email ? "border border-red-500" : "border-gray-300 focus:border-primary-600 dark:border-gray-600 dark:focus:border-blue-500"
											}`}
											aria-invalid={
												errors.email && touched.email ? "true" : undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
											required={true}
										/>
										<ErrorMessage
											className="text-xs text-red-500 pt-1"
											component="div"
											name="email"
										/>
									</div>

									<div>
										<label htmlFor="plainPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
										<input
											type="password" name="plainPassword" id="plainPassword" placeholder="••••••••"
											value={values.plainPassword ?? ""}
											required={true}
											className={`bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ${
												errors.email && touched.email ? "border border-red-500" : "border-gray-300 focus:border-primary-600 dark:border-gray-600 dark:focus:border-blue-500"
											}`}
											aria-invalid={
												errors.plainPassword && touched.plainPassword ? "true" : undefined
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

									<div>
										<label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
										<input type="confirmPassword" name="confirmPassword" id="confirmPassword" placeholder="••••••••"
											value={values.confirmPassword ?? ""}
											className={`bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 ${
												errors.email && touched.email ? "border border-red-500" : "border-gray-300 focus:border-primary-600 dark:border-gray-600 dark:focus:border-blue-500"
											}`}
											required={true}
											aria-invalid={
												errors.confirmPassword && touched.confirmPassword ? "true" : undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</div>

									<div className="flex items-start">
										<div className="flex items-center h-5">
											<input id="terms"
												type="checkbox"
												aria-describedby="terms"
												className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
												checked={agreeTerms}
												required={true}
												onChange={() => setAgreeTerms(!agreeTerms)}
											/>
										</div>
										<div className="ml-3 text-sm">
											<label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the </label>
											<a type="button" onClick={() => { setShowModal(true) }} className="font-medium text-primary-600 hover:underline dark:text-primary-500" data-modal-target="defaultModal" data-modal-toggle="defaultModal">Terms and Conditions</a>
										</div>
									</div>

									<button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
									<p className="text-sm font-light text-gray-500 dark:text-gray-400">
										Already have an account? <a href="/auth/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
									</p>

								</form>
							)}
						</Formik>
					</div>
				</div>
			</div>
			<Modal showModal={showModal} setShowModal={setShowModal} setAgreeTerms={setAgreeTerms} />
		</section>
	);
}

export default signup;
