/**
 * Extend default next-auth interface properties
 */
import NextAuth, { DefaultSession, User } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
	/**
	 * The shape of the user object returned in the OAuth providers' `profile` callback,
	 * or the second parameter of the `session` callback, when using a database.
	 */
	export interface User {   // export to use it in next-auth/jwt module
    iat: number; // BigInteger
    exp: number;
    roles: Array<string>;
    email: string;
    username: string;
    avatar: string;
    ip: string;
    tokens: AuthResponse;
  }

	/**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
	interface Session {
		user: User & DefaultSession["user"];
    expires: ISODateString;
    error?: string;
	}

	/**
	 * Usually contains information about the provider being used
	 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
	 */
	interface Account {
		access_token?: string;
		refresh_token?: string;
	}

	/** The OAuth profile returned from your provider */
	interface Profile {}

}

declare module "next-auth/jwt" {
	interface JWT extends Record<string, unknown>, DefaultJWT {
		user?: User;
		iat?: number;
		exp?: number;
		jti?: string; // (JWT ID) Claim, unique identifier for the JWT
    access_token_expires?: number;
    error?: string;
	}
}

/** Restful API authentication response */
export interface AuthResponse {
  token: string;
  refresh_token: string;
}
