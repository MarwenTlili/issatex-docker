// https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts

import NextAuth, { Account, AuthResponse, Profile, Session, TokenSet, User } from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

import jwt_decode from 'jwt-decode';
import { ENTRYPOINT } from "../../../config/entrypoint"
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"

/**
 * /!\ Note:
 * > The default base path is /api/auth but it is configurable by specifying a 
 * custom path in NEXTAUTH_URL.
 * > e.g: NEXTAUTH_URL=https://example.com/myapp/api/authentication
 * /api/auth/signin -> /myapp/api/authentication/signin
 */

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
	// site: process.env.NEXTAUTH_URL,
	debug: process.env.NODE_ENV === 'development',
	// (secret) If you set NEXTAUTH_SECRET as an environment variable, no need to define this option.
	// secret: process.env.NEXTAUTH_SECRET,	
	session: {
		strategy: 'jwt' // default: "database"
	},
	theme: {
        colorScheme: "light",
    },
    pages: {
        signIn: '/auth/signin',
		signOut: '/auth/signout',
		// error: '/auth/error', // Error code passed in query string as ?error= to 'pages/auth/error'
		// verifyRequest: '/auth/verify-request', // (used for check email message)
		// newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },

    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
		CredentialsProvider({
			// tls: {
			// 	rejectUnauthorized: false,
			// },
			// The name to display on the sign in form (e.g. "Sign in with...")
            name: "Sign in form",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
				// ############################################################
				// fetch API
				let credentialsData = null
				
				// let user: Token | null = null;
				let user: User | null = null;

				if (credentials) {
					credentialsData = {
						email: credentials.email,
						password: credentials.password,
					};
					// ENTRYPOINT => http://caddy
					const request = new Request(`${ENTRYPOINT}/auth`, {
						method: 'POST',
						headers: new Headers({ 'Content-Type': 'application/json'}),
						body: JSON.stringify(credentialsData)
					});
	
					await fetch(request)
						.then( (response) => {
							if (response.status < 200 || response.status >= 300) {
								// throw new Error(response.statusText);
								// console.log(response.statusText);
							}
							return response.json()
						})
						.then( (data: AuthResponse) => {
							const decodedAccessToken: User = jwt_decode(data.token);
							user =  decodedAccessToken
							user.tokens = data
						})
						.catch((error) => {
							console.error("Error: ", error.message);
						});
				}
				// ############################################################
				
                return user;
            }
        })
    ],

	/**
	 * Custom JWT encode/decode methods
	 */
	// https://next-auth.js.org/configuration/options#override-jwt-encode-and-decode-methods

	// https://next-auth.js.org/configuration/callbacks
    callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			let isAllowedToSignIn = true

			/**
			 * example of only user with ROLE_CLIENT can signin
			 * let isAllowedToSignIn = false
			 */
			// const uerRoles = user.roles;
			// if (user ) {
			// 	if (uerRoles.includes('ROLE_CLIENT')) {
			// 		isAllowedToSignIn = true
			// 	}
			// }

			if (isAllowedToSignIn) {
				return true
			} else {
				// Return false to display a default error message
				return false
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		},

		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url
			return baseUrl
		},

		/**
		 * https://next-auth.js.org/configuration/callbacks#jwt-callback
		 * -> getSession(), getServerSession(), useSession() will invoke this function
		 * -> Not invoked when you persist sessions in a database.
		 * -> after the user signs in. In subsequent calls, only token will 
		 * be available.
		 */
        async jwt( {token, user, account, profile, isNewUser}
			:{
				// JWT {name, email, picture, sub}
				token: JWT;	
				// AdapterUser {id, email, isVerified} extends User {} extends DefaultUser {id, name, email,image }
				user?: User | AdapterUser | undefined;	
				account?: Account | null | undefined;
				// Profile {sub?, name?, email?, image?}
				profile?: Profile | undefined;
				isNewUser?: boolean | undefined;
			}
		) {
			/** token always exists */
			// info("jwt {token}: ", token);
			
			/** 
			 * user, account, profile, isNewUser exists only if that the 
			 * callback is being invoked for the first time 
			 * (i.e. the user is being signed in)
			 */
			// user provided from async authorize()
			if ( user ) {
				// token.access_token = user.tokens.token
				token.name = user.username
				token.picture = user.avatar
				token.user = user;
				// info("jwt {user}: ", user);
			}

			if (account) {
				// info("jwt {account}: ", account);
			}

			if (profile) {
				// info("jwt {profile}: ", profile);
			}

			if (isNewUser) {
				// info("jwt {isNewUser}: ", isNewUser);
			}

			if (account && user) {
				// info("Initial SignIn from: ", user.ip)
			}

            return Promise.resolve(token);
            // return Promise.resolve(refreshAccessToken(token));
        },
		/**
		 * the jwt() callback is invoked before the session() callback, so 
		 * anything you add to the JSON Web Token will be immediately 
		 * available in the session callback, like for example an 
		 * access_token from a provider.
		 */
        async session(	{ session, user, token }
			: {
				// Session {user: User & DefaultSession["user"]}
				session: Session;
				user: User | AdapterUser;
				token: JWT;
			}
		) {
            // Send properties to the client, like an access_token and user id from a provider.
			// session.user = token.user as User;
			session.user = token.user as User
			
			// info("session {session}: ", session)
			// info("session {token}: ", token)
			// info("session {user}: ", user)
			
            return Promise.resolve(session); 
        },
    },

}

export default NextAuth(authOptions);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: TokenSet) {
	try {
		const request = new Request(`${ENTRYPOINT}/token/refresh`, {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json'}),
			body: JSON.stringify(token.refresh_token)
		});
		const response = await fetch(request)
  
		const refreshedTokens: AuthResponse = await response.json()

		if (!response.ok) {
			throw refreshedTokens
		}

		const accessTokenDecoded: User = jwt_decode(refreshedTokens.token)
  
		return {
			...token,
			accessToken: refreshedTokens.token,
			accessTokenExpires: Date.now() + accessTokenDecoded.exp * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refresh_token // Fall back to old refresh token
		}
	} catch (error: any) {
		console.error("ERROR: ", error.detail)
		return {
			...token,
			error: 'RefreshAccessTokenError'
		}
	}
}


