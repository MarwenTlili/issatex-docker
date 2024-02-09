import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { WeeklySchedule } from "../../types/WeeklySchedule";

interface Props {
  weeklyschedule?: WeeklySchedule;
}

interface SaveParams {
  values: WeeklySchedule;
}

interface DeleteParams {
  id: string;
}

const saveWeeklySchedule = async ({ values }: SaveParams) =>
  await fetch<WeeklySchedule>(
    !values["@id"] ? "/api/weekly_schedules" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteWeeklySchedule = async (id: string) =>
  await fetch<WeeklySchedule>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ weeklyschedule }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<WeeklySchedule> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveWeeklySchedule(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<WeeklySchedule> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteWeeklySchedule(id), {
    onSuccess: () => {
      router.push("/weeklyschedules");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!weeklyschedule || !weeklyschedule["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: weeklyschedule["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/weeklyschedules"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {weeklyschedule
          ? `Edit WeeklySchedule ${weeklyschedule["@id"]}`
          : `Create WeeklySchedule`}
      </h1>
      <Formik
        initialValues={
          weeklyschedule
            ? {
                ...weeklyschedule,
              }
            : new WeeklySchedule()
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
                router.push("/api/weekly_schedules");
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
                htmlFor="weeklyschedule_startAt"
              >
                startAt
              </label>
              <input
                name="startAt"
                id="weeklyschedule_startAt"
                value={values.startAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.startAt && touched.startAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.startAt && touched.startAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="startAt"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="weeklyschedule_endAt"
              >
                endAt
              </label>
              <input
                name="endAt"
                id="weeklyschedule_endAt"
                value={values.endAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.endAt && touched.endAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.endAt && touched.endAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="endAt"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="weeklyschedule_observation"
              >
                observation
              </label>
              <input
                name="observation"
                id="weeklyschedule_observation"
                value={values.observation ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.observation && touched.observation
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.observation && touched.observation ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="observation"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="weeklyschedule_manufacturingOrder"
              >
                manufacturingOrder
              </label>
              <input
                name="manufacturingOrder"
                id="weeklyschedule_manufacturingOrder"
                value={values.manufacturingOrder as string ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.manufacturingOrder && touched.manufacturingOrder
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.manufacturingOrder && touched.manufacturingOrder
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="manufacturingOrder"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="weeklyschedule_ilot"
              >
                ilot
              </label>
              <input
                name="ilot"
                id="weeklyschedule_ilot"
                value={values.ilot as string ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.ilot && touched.ilot ? "border-red-500" : ""
                }`}
                aria-invalid={errors.ilot && touched.ilot ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="ilot"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                dailyProductions
              </div>
              <FieldArray
                name="dailyProductions"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="weeklyschedule_dailyProductions">
                    {values.dailyProductions &&
                    values.dailyProductions.length > 0 ? (
                      values.dailyProductions.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`dailyProductions.${index}`} />
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
        {weeklyschedule && (
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
