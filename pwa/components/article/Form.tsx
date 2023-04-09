import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Article } from "../../types/Article";
import { Alert, Box, Button, Container, createTheme, CssBaseline, Grid, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CustomizedSnackbar from "../CustomizedSnackbar";
import { log } from "console";

interface Props {
	article?: Article;
}

interface SaveParams {
	values: Article;
}

interface DeleteParams {
	id: string;
}

const theme = createTheme();

const saveArticle = async ({ values }: SaveParams) =>
	await fetch<Article>(!values["@id"] ? "/api/articles" : values["@id"], {
		method: !values["@id"] ? "POST" : "PUT",
		body: JSON.stringify(values),
	});

const deleteArticle = async (id: string) =>
	await fetch<Article>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ article }) => {
	const [, setError] = useState<string | null>(null);
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

	return (
		<ThemeProvider theme={theme}>
			<Container maxWidth="xs" sx={{pt: 4}}>
				{/* <CssBaseline /> */}
				<Stack direction={{ xs: 'column', sm: 'row' }} >
					<Box 
						sx={{
							display: 'flex',
							'& > :not(style)': { m: 1 },
							justifyContent: 'flex-start'
						}}
					>
						<h3>
							{article ? `Edit Article "${article["designation"]}"` : `Create Article`}
						</h3>
					</Box>
				</Stack>

				<Grid>
					<Formik
						initialValues={ article ?{ ...article, } :new Article() }
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
										// router.push("/articles");
									},
									onError: (error) => {
										console.log(error);
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
							<form onSubmit={handleSubmit}>
								<div >
									{/* <label htmlFor="article_designation" >
										designation
									</label> */}
									<TextField
										label="Designation"
										variant="outlined"
										margin="normal"
										fullWidth
										// required

										error={errors.designation? true :false}
										helperText="Enter Article Designation"
										
										name="designation"
										id="article_designation"
										value={values.designation ?? "designation"}
										type="text"
										placeholder=""
										className={`mt-1 block w-full ${
											errors.designation && touched.designation
											? "border-red-500"
											: ""
										}`}
										aria-invalid={
											errors.designation && touched.designation ? "true" : undefined
										}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<ErrorMessage
										className="text-xs text-red-500 pt-1"
										component="div"
										name="designation"
									/>
								</div>
								<div className="mb-2">
									{/* <label htmlFor="article_model" >
										model
									</label> */}
									<TextField
										label="Model"
										variant="outlined"
										margin="normal"
										fullWidth
										// required

										helperText="Enter Article Model Name"

										name="model"
										id="article_model"
										value={values.model ?? ""}
										type="text"
										placeholder=""
										className={`mt-1 block w-full ${
											errors.model && touched.model ? "border-red-500" : ""
										}`}
										aria-invalid={
											errors.model && touched.model ? "true" : undefined
										}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<ErrorMessage
										component="div"
										name="model"
									/>
								</div>
								<div className="mb-2">
									{/* <label htmlFor="article_composition" >
										composition
									</label> */}
									<TextField
										label="Composition"
										variant="outlined"
										margin="normal"
										fullWidth

										helperText="Enter Article Compositions"

										name="composition"
										id="article_composition"
										value={values.composition ?? ""}
										type="text"
										placeholder=""
										className={`mt-1 block w-full ${
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
								
								<Grid
									container
									direction="row"
									justifyContent="space-evenly"
									alignItems="center"
								>
									<Button variant="contained" type="submit" 
										color="success"
										disabled={isSubmitting} 
										endIcon={<SendIcon />}
										sx={{
											mb: 2
										}}
									>
										Submit
									</Button>
									{article && (
										<Button 
											variant="outlined" 
											color="error"
											startIcon={<DeleteIcon />}
											onClick={handleDelete}
											sx={{
												mb: 2
											}}
										>
											Delete
										</Button>
									)}
								</Grid>

								{status && status.msg && (
									<Alert variant="standard" severity={status.isValid ?"info" :"error"}>
										{status.msg}
									</Alert>
								)}

							</form>
						)}
					</Formik>
				</Grid>
				
			</Container>
		</ThemeProvider>
	);
};
			