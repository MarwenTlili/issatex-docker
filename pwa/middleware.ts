import { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"
import { NextRequest } from "next/server";

/**
 * checks if the user is authenticated/authorized.
 * If they aren't, they will be redirected to the login page.
 */
// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
	callbacks: {
		authorized({ req, token }: {req: NextRequest, token: JWT | null}) {
      /** If there is a token, the user is authenticated */
			// if(token) return true

			if(!token) return false;

			if (req.nextUrl.pathname.startsWith("/articles")
        || req.nextUrl.pathname.startsWith("/profile")
      ) {
				let isAuthorized: boolean = false;
        const articleAuthorizedRoles: Array<string> = ["ROLE_COMPANY"];
        isAuthorized = articleAuthorizedRoles.every( role => {
          if(token.user){
            return token.user.roles.includes(role);
          }
        });
				return isAuthorized;
			}

			/** `/` only requires the user to be logged in */
			return !!token;
		},
	},
})

export const config = {
	matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth/signin
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|auth/signin|_next/static|_next/image|favicon.ico).*)',
		// '/articles',
		// '/articles/(.*)'
	]
}
