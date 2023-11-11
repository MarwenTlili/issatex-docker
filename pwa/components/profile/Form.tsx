import { FunctionComponent, useState, ChangeEvent, useRef } from "react";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useMutation } from "react-query";
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { MEDIA_OBJECTS_URL } from "../../config/entrypoint";
import { User } from "../../types/User";
import { MediaObject } from "../../types/MediaObject";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import * as Yup from "yup";

/** contains values attribute with type of object you want to submit */
interface SaveParams {
	values: User;
}

/** add optional confirmPassword to User (for validation) then omit it later when submitting */
interface CustomUser extends User{
	confirmPassword?: string | undefined;
}

/** main form props */
interface Props {
	user?: User;
}

/** function that save user using fetch (defined in utils/dataAccess)  */
const saveUser = async ( {values}: SaveParams) =>
	await fetch<User>(!values["@id"] ? "/api/users" : values["@id"], {
		method: !values["@id"] ? "POST" : "PUT",
		body: JSON.stringify(values),
	});

/** upload avatar file using fetch (defined in utils/dataAccess) */
const uploadAvatar = async ( formData: FormData) =>
	await fetch<MediaObject>(
		MEDIA_OBJECTS_URL,
		{method: "POST", body: formData}
	);

/** profile form component, takes user as props when editing profile */
export const Form: FunctionComponent<Props> = ({ user }) => {
	const [avatarFile, setAvatarFile] = useState<File|undefined>(undefined);
	const avatarRef = useRef<HTMLInputElement | null>(null);

	/** update Next-Auth session without relogin user */
	const { update } = useSession();

	const ProfileSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
		username: Yup.string().min(3).max(20).required(),
		plainPassword: Yup.string().min(6),
		confirmPassword: Yup.string(),
	});

	/**
	 * add unmapped confirmPassword to initialValues (user:User)
	 * then remove it later when submitting form
	 */
	let confirmPassword: string | undefined = undefined;
	const newUser = new User();
	let customInitials: CustomUser = user ? { ...user, confirmPassword } : { ...newUser, confirmPassword };

	const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setAvatarFile(file);
		}
	}

	const saveMutation = useMutation<
		FetchResponse<User> | undefined, Error | FetchError, SaveParams
	>( (saveParams) => saveUser(saveParams) );

	const handleSubmit = async (customValues: CustomUser, {setStatus, setSubmitting, setErrors }: FormikHelpers<User>) => { 
        /**
         * OR
         * const values = delete customValues["confirmPassword"];
        */
       const {confirmPassword: _, ...values} = customValues;
       
       const isCreation = !values["@id"];

		/**
		 * if there is an "avatar" to upload/update
		 * upload it and use it's response to set User.avatar (id)
		 */
		if (avatarFile) {
			const formData = new FormData();
			formData.append("file", avatarFile);
			try {
				const response = await uploadAvatar(formData);
				if (response && response.data) {
					values.avatar = response.data["@id"];
					update({ avatar: response.data.contentUrl });
				}
			} catch (error) {
				console.error(error);
			}
		}

		/**
		 * submit user form whith changed vales
		 */
		saveMutation.mutate(
			{values},
			{
				onSuccess: () => {
					setStatus({
						isValid: true,
						msg: `Profile ${isCreation ? "created" : "updated"}.`,
					});
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

		/**
		 * remove selected file if exists, and reset file input value
		 */
		setAvatarFile(undefined);
		if (avatarRef.current) {
			avatarRef.current.value = "";
		}
	}


    return (
        <div className="container mx-auto px-4 max-w-2xl mt-4">
            <h1 className="text-3xl my-2">
                {user ? `Edit "${user["username"]}" Profile ` : `Create User`}
            </h1>
            <Formik
                // without confirmPassword: user? { ...user } : new User()
                initialValues={ customInitials }
                validationSchema={ProfileSchema}
                validate={(values) => {
                    // add your validation logic here
                    const errors: User = {};

                    // validate plainPassword and confirmPassword only if one of them is not empty
                    if ((values.plainPassword || values.confirmPassword) && (values.plainPassword != values.confirmPassword)) {
                        errors.plainPassword = "passwords does not match!";
                    }

                    return errors;
                }}
                onSubmit={handleSubmit}
            >
            {({values, status, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting, isValid}) => (
                <form className="shadow-md p-4" onSubmit={ handleSubmit } autoComplete="off">
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
                            htmlFor="user_avatar"
                        > 
                            avatar 
                        </label>
                        <input
                            ref={avatarRef}
                            name="avatar"
                            id="user_avatar"
                            type="file"
                            placeholder=""
                            className={`mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                                errors.avatar && touched.avatar ? "border-red-500" : ""
                            }`}
                            aria-invalid={
                                errors.avatar && touched.avatar ? "true" : undefined
                            }
                            onChange={handleAvatarChange}
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
                            password
                        </label>
                        <input
                            name="plainPassword"
                            id="user_plainPassword"
                            value={values.plainPassword ?? ""}
                            type="password"
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
                            autoComplete="new-password"
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
                            htmlFor="user_plainPassword"
                        >
                            confirm password
                        </label>
                        <input 
                            name="confirmPassword"
                            id="user_confirmPassword"
                            value={values.confirmPassword ?? ""}
                            type="password" 
                            className={`mt-1 block w-full ${
                                errors.confirmPassword && touched.confirmPassword
                                ? "border-red-500"
                                : ""
                            }`}
                            aria-invalid={
                                errors.confirmPassword && touched.confirmPassword
                                ? "true"
                                : undefined
                                }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="mb-2">
                        <label
                            className="text-gray-700 block text-sm font-bold"
                            htmlFor="user_createdAt"
                        >
                            createdAt: {values.createdAt?.toLocaleString() ?? ""}
                        </label>
                    </div>

                    <div className="mb-2">
                        <label
                            className="text-gray-700 block text-sm font-bold"
                            htmlFor="user_lastLoginAt"
                        >
                            lastLoginAt: {values.lastLoginAt?.toLocaleString() ?? ""}
                        </label>
                    </div>

                <div className="mb-2">
                    <label
                        className="text-gray-700 block text-sm font-bold"
                        htmlFor="user_roles"
                    >
                        roles: { values.roles.map( (role: string) => <span key={role}>{role}, </span> ) }
                    </label>
                </div>

                <div className="mb-2">
                    <label
                        className="text-gray-700 block text-sm font-bold"
                        htmlFor="user_isVerified"
                    >
                        isVerified: {values.isVerified? "true" : "false"}
                    </label>
                </div>

                <button type="submit"
                    className={classNames(
                        "inline-block mt-2 text-sm text-white font-bold py-2 px-4 rounded",
                        isValid ? "bg-cyan-500 hover:bg-cyan-700" : "bg-gray-500 hover:bg-gray-700"
                    )}
                    disabled={!isValid || isSubmitting}
                > 
                    Submit 
                </button>

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

                </form>
            )}
            </Formik>
        </div>
    );
};
