/**
 * Extend default next-auth interface properties
 */
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
	/**
	 * The shape of the user object returned in the OAuth providers' `profile` callback,
	 * or the second parameter of the `session` callback, when using a database.
	 * default:
	 * 		name?: string | null
     * 		email?: string | null
     * 		image?: string | null
	 */
	interface User {
		iat: BigInteger
		exp: number
		roles: Array<string>
		email: string
		username: string
		avatar: string
		ip: string
		tokens: AuthResponse
	}

	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	*/
	interface Session {
		// user: User & DefaultSession["user"]
		user: User & DefaultSession["user"]
	}

	/**
	 * Usually contains information about the provider being used
	 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
	 */
	interface Account {
		access_token: sring
		refresh_token: string
	}

	/** The OAuth profile returned from your provider */
	interface Profile {}

	/** */
	interface AuthResponse {
		token: string
		refresh_token: string;
	}
}

declare module "@auth/core/types" {
	interface Session {
		error?: "RefreshAccessTokenError"
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		access_token: string
		expires_at: number
		refresh_token: string
		error?: "RefreshAccessTokenError"
	}
}