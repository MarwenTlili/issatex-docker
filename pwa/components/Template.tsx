import { ReactNode } from "react"
import StickyFooter from "./Footer"
import Header from "./Header"

export default function Template({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main>{children}</main>
			<StickyFooter />
		</>
	)
};
