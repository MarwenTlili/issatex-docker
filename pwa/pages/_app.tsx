import '../styles/globals.css'
import { NextComponentType } from "next";
import Layout from "../components/common/Layout";
import type { AppProps } from 'next/app'

type CustomAppProps = AppProps & {
	// Component: NextComponentType & {auth?: boolean}
	Component: NextComponentType
}

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
function App( {Component, pageProps: { session, ...pageProps } }: CustomAppProps): JSX.Element {
	return (
		<Layout dehydratedState={pageProps.dehydratedState} >
			<Component {...pageProps} />
		</Layout>
	)
}
export default App;
