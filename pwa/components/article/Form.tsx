import { 
	FunctionComponent, 
	useState 
} from "react";

import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { 
	ErrorMessage, 
	Formik 
} from "formik";

import { 
	fetch, 
	FetchError, 
	FetchResponse 
} from "../../utils/dataAccess";

import { Article } from "../../types/Article";
import SnackbarCustomized, { 
	AlertColor, 
	SnackbarOrigin, 
	SnackbarState 
} from "../SnackbarCustomized";

interface FormProps {
	article?: Article;
}

interface SaveParams {
	values: Article;
}

interface DeleteParams {
	id: string;
}

const snackbarPosition: SnackbarOrigin = {
	vertical: 'bottom',		// 'top' | 'bottom'
	horizontal: 'center'	// 'left' | 'center' | 'right'
}

const saveArticle = async ({ values }: SaveParams) =>
	await fetch<Article>(!values["@id"] ? "/api/articles" : values["@id"], {
		method: !values["@id"] ? "POST" : "PUT",
		body: JSON.stringify(values),
	});

const deleteArticle = async (id: string) =>
	await fetch<Article>(id, { method: "DELETE" });

export const Form: FunctionComponent<FormProps> = ({ article }) => {
	const [, setError] = useState<string | null>(null);
	const [, setShowSnackbar] = useState(true);

	const router = useRouter();

	const saveMutation = useMutation<
		FetchResponse<Article> | undefined,
		Error | FetchError,
		SaveParams
	>((saveParams) => saveArticle(saveParams));

	const deleteMutation = useMutation<
		FetchResponse<Article> | undefined,
		Error | FetchError,
		DeleteParams
	>(({ id }) => deleteArticle(id), {
		onSuccess: () => {
			router.push("/articles");
		},
		onError: (error) => {
			setError(`Error when deleting the resource: ${error}`);
			console.error(error);
		},
	});

	const handleDelete = () => {
		if (!article || !article["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;
		deleteMutation.mutate({ id: article["@id"] });
	};

	const [snackbarState, setSnackbarState] = useState<SnackbarState>({
		open: false,			// CustomizedSnackbar -> SnackbarState<I>
		severity: 'info',	// CustomizedSnackbar -> SnackbarState<I>
		message: 'UNKNOWN',		// CustomizedSnackbar -> SnackbarState<I>
		vertical: snackbarPosition.vertical,		// 'top' | 'bottom' Snackbar.d.ts -> SnackbarOrigin<I> 
		horizontal: snackbarPosition.horizontal,	// 'start' | 'center' | 'end' Snackbar.d.ts -> SnackbarOrigin<I>
	});

	const handleSnackbarOpen = (newState: any, severity: AlertColor, message: string | string[]) => {
		setShowSnackbar(true);
		setSnackbarState({ ...newState, open: true, severity: severity, message: message});
	}

	const handleSnackbarClose = () => {
		setSnackbarState( {...snackbarState, open: false} )
	}

	return (
		<div className="flex flex-col items-center justify-start h-screen">
			<div className="grid place-content-center p-4 font-mono text-2xl">
				{article ? `Edit Article "${article["designation"]}"` : `Create new Article`}
			</div>
			<Formik
				initialValues={ article ?{ ...article, } :new Article() }
				validate={(values) => {
					const errors: any = {};
					// add your validation logic here
					if (!values.designation) {
						errors.designation = "Required"
					}
					if (!values.model) {
						errors.model = "Required"
					}
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
									msg: `Article ${isCreation ? "created" : "updated"}.`,
								});
								handleSnackbarOpen( snackbarPosition, "success", `Article ${isCreation ? "created" : "updated"}.`)
								// router.push("/articles");
							},
							onError: (error) => {
								// console.log(error);
								setStatus({
									isValid: false,
									msg: `${error.message}`,
								});
								if ("fields" in error) {
									setErrors(error.fields);
								}
								handleSnackbarOpen( snackbarPosition, "error", error.message )
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
					<form className="relative p-2 space-y-4 w-5/6 md:w-4/5 lg:w-2/3 " onSubmit={handleSubmit}>
						<div className="relative z-0 w-full pb-4 group">
							<input 
								name="designation"
								id="article_designation" 
								value={values.designation ?? ""}
								type="text" 
								placeholder=" " 
								className={`block py-2.5 px-0 w-full font-mono text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600  peer ${
									errors.designation && touched.designation
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.designation && touched.designation ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
								// required
							/>
							<label 
								htmlFor="article_designation" 
								className="peer-focus:font-mono absolute font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Designation
							</label>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="designation"
							/>
						</div>

						<div className="relative z-0 w-full pb-4 group">
							<input 
								name="model" 
								id="article_model" 
								value={values.model ?? ""}
								type="text" 
								placeholder=" " 
								className={`block py-2.5 px-0 w-full font-mono text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600  peer ${
									errors.model && touched.model
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.model && touched.model ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
								// required
							/>
							<label 
								htmlFor="article_model" 
								className="peer-focus:font-mono absolute font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Model
							</label>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="model"
							/>
						</div>

						<div className="relative z-0 w-full pb-4 group">
							<textarea 
								rows={2}
								name="composition" 
								id="article_composition" 
								value={values.composition ?? ""}
								placeholder=" " 
								className={`block py-2.5 px-0 w-full font-mono text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600  peer ${
									errors.composition && touched.composition
									? "border-red-500"
									: ""
								}`}
								aria-invalid={
									errors.composition && touched.composition ? "true" : undefined
								}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<label 
								htmlFor="article_composition" 
								className="peer-focus:font-mono absolute font-mono text-sm text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>
								Composition
							</label>
							<ErrorMessage
								className="text-xs text-red-500 pt-1"
								component="div"
								name="composition"
							/>
						</div>

						{/* <div className="mb-2">
							<div>
								manufacturingOrders
							</div>
							<FieldArray
								name="manufacturingOrders"
								render={(arrayHelpers) => (
									<div className="mb-2" id="article_manufacturingOrders">
									{values.manufacturingOrders &&
									values.manufacturingOrders.length > 0 ? (
										values.manufacturingOrders.map(
										(item: any, index: number) => (
											<div key={index}>
											<Field name={`manufacturingOrders.${index}`} />
											<button
												type="button"
												onClick={() => arrayHelpers.remove(index)}
											>
												-
											</button>
											<button
												type="button"
												onClick={() => arrayHelpers.insert(index, "")}
											>
												+
											</button>
											</div>
										)
										)
									) : (
										<button
										type="button"
										onClick={() => arrayHelpers.push("")}
										>
										Add
										</button>
									)}
									</div>
								)}
							/>
						</div> */}
						
						<div className="flex" >
							<button 
								type="submit" 
								className="text-white bg-cyan-500 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 "
								disabled={isSubmitting}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send w-5 h-5 mr-2 -ml-1" viewBox="0 0 16 16">
									<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
								</svg>
									Submit
							</button>
							{article && (
								<button 
									type="button" 
									className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 "
									onClick={handleDelete}
								>
									Delete
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash w-5 h-5 ml-2 -mr-1" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
									</svg>
								</button>
							)}
						</div>

						{status && status.msg && (
							<SnackbarCustomized snackbarState={snackbarState} handleSnackbarClose={handleSnackbarClose} />
						)}

					</form>
				)}
			</Formik>
		</div>
	);
};
