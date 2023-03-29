import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Article } from "../../types/Article";

interface Props {
  article?: Article;
}

interface SaveParams {
  values: Article;
}

interface DeleteParams {
  id: string;
}

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
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/articles"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {article ? `Edit Article ${article["@id"]}` : `Create Article`}
      </h1>
      <Formik
        initialValues={
          article
            ? {
                ...article,
              }
            : new Article()
        }
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
                router.push("/api/articles");
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
                htmlFor="article_designation"
              >
                designation
              </label>
              <input
                name="designation"
                id="article_designation"
                value={values.designation ?? ""}
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
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="article_model"
              >
                model
              </label>
              <input
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
                className="text-xs text-red-500 pt-1"
                component="div"
                name="model"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="article_composition"
              >
                composition
              </label>
              <input
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
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
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
        {article && (
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
