import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { SignInResponse, getCsrfToken } from "next-auth/react"
import { signIn } from "next-auth/react"
import { 
	AlertColor,
	Avatar, 
	Box, 
	Button, 
	Checkbox, 
	Container, 
	CssBaseline, 
	FormControlLabel, 
	Grid, 
	SnackbarOrigin, 
	TextField, 
	ThemeProvider, 
	Typography, 
	createTheme,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import CustomizedSnackbar, { SnackbarState } from "../../components/CustomizedSnackbar";

const theme = createTheme();

const snackbarPosition: SnackbarOrigin = {
	vertical: 'bottom',
	horizontal: 'center'
}

/**
 * 
 * @param csrfToken 
 * @returns MUI Signin Form
 */
function SignInMUI({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { push } = useRouter();
	const router = useRouter();
	const {error} = router.query;

	useEffect( () => {
		if (error) {
			handleSnackbarOpen( snackbarPosition, 'warning', error);
		}
	}, [error])

	const [snackbarState, setSnackbarState] = useState<SnackbarState>({
		open: false,			// CustomizedSnackbar -> SnackbarState<I>
		alertSeverity: 'error',	// CustomizedSnackbar -> SnackbarState<I>
		message: 'UNKNOWN',		// CustomizedSnackbar -> SnackbarState<I>
		vertical: 'bottom',		// Snackbar.d.ts -> SnackbarOrigin<I>
		horizontal: 'center',	// Snackbar.d.ts -> SnackbarOrigin<I>
	});

	const handleSnackbarOpen = (newState: any, severity: AlertColor, message: string | string[]) => {
		setSnackbarState({ ...newState, open: true, severity: severity, message: message});
	}

	const handleSnackbarClose = () => {
		setSnackbarState( {...snackbarState, open: false} )
	}

    const handleSubmit = async (event: any) => {
        event.preventDefault();

		const data = new FormData(event.currentTarget);
		const email = data.get('email');
		const password = data.get('password');

		// will handle obtaining the CSRF token for you
		// https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
        await signIn( 'credentials', {
			email, 
			password,
			// which URL the user will be redirected after signing in.
			// callbackUrl: `${window.location.origin}`,	// default: /auth/signin, window.location.origin
			redirect: false	// false: to handle errors in same page 'siginin' / 'credentials-signin'
		})
		.then( ( value: SignInResponse | undefined) => {
			if (value) {
				console.log("status: ", value.status);
				switch (value.status) {
					case 200:
						push('/'); break;
					case 401:
						handleSnackbarOpen( snackbarPosition, 'warning', 'Wrong credentials !')
						break;
					case 500:
						handleSnackbarOpen( snackbarPosition, 'error', 'Internal server error !')
						break;
					default: break;
				}
			}
		})
		.catch( ({ error, status, ok} ) => {
			console.log(`signIn credentials callbacks: ${error}, ${status}, ${ok}`);
			if (status == 401) {
				handleSnackbarOpen( snackbarPosition, 'error', error)
			}
		});
    };

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />

				{/* SignIn Form */}
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel label="Remember me"
							control={<Checkbox value="remember" color="primary" />}
						/>
						<Button type="submit" fullWidth variant="contained" 
							sx={{ mt: 3, mb: 2 }} 
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="#" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				
				{/* Copyright under form */}
				<Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
					{'Copyright © '}
					<Link color="inherit" href="/">
						Issatex
					</Link>{' '}
					{new Date().getFullYear()}
					{'.'}
				</Typography>
				
				{/* snackbar for showing warning, error, ... */}
				<CustomizedSnackbar
					snackbarState={snackbarState} 
					handleSnackbarClose={handleSnackbarClose}
				/>

			</Container>
		</ThemeProvider>
	)
}

export default SignInMUI;

/**
 * Server-Side Rendering
 * pre-render this page on each request using the data returned by getServerSideProps
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const serverSession = await getServerSession(context.req, context.res, authOptions)

	// redirect to home '/' if user is already signed in 
	if (serverSession) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}
	
	return {
		props: {
			csrfToken: (!context) && await getCsrfToken(context),
			session: serverSession
		},
	}
}
