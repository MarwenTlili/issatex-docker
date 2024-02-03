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
        authorized({ req, token }: { req: NextRequest, token: JWT | null }) {
            /** If there is a token, the user is authenticated */
            // if(token) return true

            if (!token) return false;

            const commonAuthorizedPaths = ["/profile"];

            if (commonAuthorizedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
                const authorizedRoles: string[] = ["ROLE_CLIENT", "ROLE_SECRETARY"];
                return authorizedRoles.some((role) =>
                    token.user?.roles.includes(role)
                );
            }

            const roleSpecificPaths: { [key: string]: string[] } = {
                "/articles": ["ROLE_CLIENT"],
                "/manufacturing-orders": ["ROLE_CLIENT"],
                "/employees": ["ROLE_SECRETARY"],
                "/weekly-schedules": ["ROLE_SECRETARY"],
            };

            const currentPath = req.nextUrl.pathname;
            if (roleSpecificPaths[currentPath]) {
                const authorizedRoles: string[] = roleSpecificPaths[currentPath];
                return authorizedRoles.some((role) =>
                    token.user?.roles.includes(role)
                );
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
         * - signup
         * - admin
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|auth/signin|signup|admin|_next/static|_next/image|favicon.ico).*)',
        // '/articles',
        // '/articles/(.*)'
    ]
}
