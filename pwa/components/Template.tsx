import { ReactNode, useState } from "react"
import StickyFooter from "./Footer"
import Header from "./Header"
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Template({ children }: { children: ReactNode }) {
	const { push } = useRouter();

	const { status, data: session } = useSession({
		required: true,
		onUnauthenticated() {
			console.log("NextAuth Session: Unauthenticated !");
			push('/auth/signin')
		},
	})

	return (
		<>
			<Header />
			<main>{children}</main>
			<StickyFooter />
		</>
	)
}
