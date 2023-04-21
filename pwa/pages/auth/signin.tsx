import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SnackbarCustomized, { 
	AlertColor, 
	SnackbarOrigin, 
	SnackbarState 
} from "../../components/SnackbarCustomized";

const snackbarPosition: SnackbarOrigin = {
	vertical: 'bottom',		// 'top' | 'bottom'
	horizontal: 'center'	// 'left' | 'center' | 'right'
}

/**
 * 
 * @param csrfToken 
 * @returns MUI Signin Form
 */
function SignInTailwind() {
	const router = useRouter();
	const {error} = router.query;
	const {callbackUrl} = router.query;

	const [, setShowSnackbar] = useState(true);

	useEffect( () => {
		if (callbackUrl) {
			handleSnackbarOpen(snackbarPosition, "warning", "authentication is required");
		}
		
		if (error) {
			handleSnackbarOpen(snackbarPosition, "warning", error);
		}
	}, [error])

	const [snackbarState, setSnackbarState] = useState<SnackbarState>({
		open: false,	// false | true
		severity: "error",	// 'success' | 'info' | 'warning' | 'error'
		message: "UNKNOWN",	// string 
		vertical: snackbarPosition.vertical,		// 'top' | 'bottom' 
		horizontal: snackbarPosition.horizontal,	// 'start' | 'center' | 'end' 
	});

	const handleSnackbarOpen = (newState: any, severity: AlertColor, message: string | string[]) => {
		setShowSnackbar(true);
		setSnackbarState({ ...newState, open: true, severity: severity, message: message});
	}

	const handleSnackbarClose = () => {
		setSnackbarState( {...snackbarState, open: false} )
	}

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    };

	return (
		<div>
			{/* px-4 py-12 sm:px-6 lg:px-8 */}
			<div className="flex items-center justify-center pt-8 px-2 py-2">
				<div className="w-full max-w-md shadow-lg shadow-black-500/50 p-2 mb-6">
					<div className="grid place-content-center mt-4">
						<div className="mx-auto h-12 w-auto" >
							<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
								<path className="fill-indigo-500" fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z" /> 
							</svg>
						</div>
						<h2 className="pose prose-2xl mt-6 font-bold tracking-tight text-gray-900">
							Sign in to your account
						</h2>
						<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
							Sign up
						</a>
						</p>
					</div>
					<form className=" px-8" method="POST" onSubmit={handleSubmit}>
						<input type="hidden" name="remember" defaultValue="true" />
						<div className="rounded-md shadow-sm">
							<div className="">
								<label htmlFor="email" className="pose md:prose-lg lg:prose-xl block mb-2 font-medium text-gray-900 dark:text-white">Your Email</label>
								<div className="relative mb-2">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
										</svg>
									</div>
									<input 
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
										type="text" id="email" name="email" placeholder="mail@example.com" />
								</div>
								
								<label htmlFor="password" className="pose md:prose-lg lg:prose-xl block mb-2 font-medium text-gray-900 dark:text-white">Your Password</label>
								<div className="relative mb-2">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-key-fill text-gray-500 dark:text-gray-400" viewBox="0 0 16 16"> 
											<path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
										</svg>
									</div>
									<input 
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										type="password" id="password" name="password" autoComplete="on" placeholder="********" />
								</div>

							</div>
							
						</div>

						<div className="block-flex sm:flex sm:justify-between sm:items-center">
							<div className="flex items-center">
								<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
								Forgot your password?
								</a>
							</div>
						</div>

						<div>
							<button
								className="prose md:prose-lg lg:prose-xl group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								type="submit"
							>
								<span className="absolute inset-y-0 left-0 flex items-center pl-3">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
										<path className="" d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
									</svg>
								</span>
								Sign in
							</button>
						</div>
					</form>
				</div>
			</div>

			<SnackbarCustomized snackbarState={snackbarState} handleSnackbarClose={handleSnackbarClose} />

		</div>
	)
}

export default SignInTailwind;
