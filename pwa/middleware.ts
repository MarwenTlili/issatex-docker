import { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"
import { NextRequest } from "next/server";

/**
 * checks if the user is authenticated/authorized. 
 * If if they aren't, they will be redirected to the login page.
 */
// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
	callbacks: {
		authorized({ req, token }: {req: NextRequest, token: JWT | null}) {
			// if(token) return true /** If there is a token, the user is authenticated */

			/** `/admin` requires admin role */
			if (req.nextUrl.pathname === "/articles") {
				// return token?.userRole === "admin"
				
				// console.log("token: ", token);
				return token?.user.roles.includes("ROLE_COMPANY")
			}
			/** `/` only requires the user to be logged in */
			return !!token
		},
	},
})

export const config = { 
	matcher: [
		// "/",
		"/articles"
	]
}
