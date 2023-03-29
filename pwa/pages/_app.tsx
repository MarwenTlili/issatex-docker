import { SessionProvider, useSession } from "next-auth/react"

import '../styles/globals.css'
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

import type { AppProps } from 'next/app'

import Layout from "../components/common/Layout";
import { NextComponentType } from "next";
import { ReactElement } from "react";

type CustomAppProps = AppProps & {
	Component: NextComponentType & {auth?: boolean}
}

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
// }: AppProps<{ session: Session, dehydratedState: DehydratedState }>) {
function App( {Component, pageProps: { session, ...pageProps } }: CustomAppProps): JSX.Element {
	return (
		<SessionProvider session={session}>
			{Component.auth ? (
				<Auth>
					<Layout dehydratedState={pageProps.dehydratedState} >
						<Component {...pageProps} />
					</Layout>
				</Auth>
			) : (
				<Layout dehydratedState={pageProps.dehydratedState} >
					<Component {...pageProps} />
				</Layout>
			)}
		</SessionProvider>
	)
}
export default App;

function Auth({ children }: {children: ReactElement}): JSX.Element {
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { status } = useSession({ required: true })
  
	if (status === "loading") {
		return <div>Loading...</div>
	}
  
	return children
}