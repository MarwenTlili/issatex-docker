// https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts

import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import jwt_decode from 'jwt-decode';
import { ENTRYPOINT } from "../../../config/entrypoint"
import { AuthResponse } from "../../../types/next-auth";

/**
 * For more information on each option (and a full list of options) go to
 * https://next-auth.js.org/configuration/options
 */
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

	/**
   * https://next-auth.js.org/configuration/providers/oauth
   */
	providers: [
		CredentialsProvider({
			/** The name to display on the sign in form (e.g. "Sign in with...") */
			name: "Sign in form",
      /**
       * `credentials` is used to generate a form on the sign in page.
       * You can specify which fields should be submitted, by adding keys to the `credentials` object.
       * e.g. domain, username, password, 2FA token, etc.
       * You can pass any HTML attribute to the <input> tag through the object.
       */
			credentials: {
        email: { label: "Email", type: "text", placeholder: "your email" },
        password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
        let credentialsData = null

        /** If you return null then an error will be displayed advising the user to check their details. */
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

          await fetch(request).then( (response) => {
            if (response.status < 200 || response.status >= 300) {
              // throw new Error(response.statusText);
              // info(response.statusText);
            }
            return response.json()
          }).then( (data: AuthResponse) => {
            const decodedAccessToken: User = jwt_decode(data.token);
            // Any object returned will be saved in `user` property of the JWT
            user =  decodedAccessToken
            user.tokens = data
          }).catch((error) => {
            console.error("Error: ", error.message);
          });
        }
        return user;
			}
		})
	],

	/**
	 * Custom JWT encode/decode methods
   * https://next-auth.js.org/configuration/options#override-jwt-encode-and-decode-methods
	 */
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			let isAllowedToSignIn = true

			/** example of only user with ROLE_CLIENT can signin */
      // let isAllowedToSignIn = false
			// const uerRoles = user.roles;
			// if (user ) {
			// 	if (uerRoles.includes('ROLE_CLIENT')) {
			// 		isAllowedToSignIn = true
			// 	}
			// }
      
      // Allow only verified users to signin
      if (typeof user.isVerified != "undefined"){
        isAllowedToSignIn = user.isVerified
      }

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
		async jwt({token, user, account, session, trigger}) {
      const now = Date.now();

      /** Initial sign in */
			if (account && user ) { // user provided from async authorize()
				token.name = user.username;
				token.picture = user.avatarContentUrl
				token.iat = user.iat;
				token.exp = user.exp;
        // token.email = user.email;  // already detected and set

        const signin_user = {
          access_token: user.tokens.token,
          refresh_token: user.tokens.refresh_token,
          access_token_expires: user.exp * 1000,
          user
        };
        return signin_user;
      }

      /**
       * session.avatar sent by the front-end
       * eg in: components/profile/form.tsx
       * update({avatar : response.data.contentUrl});
       */
      if (trigger === "update" && session?.avatar) {
        console.log("trigger: ", trigger);
        if (token.user) token.user.avatarContentUrl = session.avatar;
      }

      /** Return previous token if the access token has not expired yet */
      if (token.access_token_expires && now < token.access_token_expires) {
        return token
      }

      /** access_token expired, request new one*/
      return refreshAccessToken(token);
    },

		/**
		 * the jwt() callback is invoked before the session() callback, so
		 * anything you add to the JSON Web Token will be immediately
		 * available in the session callback, like for example an access_token from a provider.
		 */
		async session({ session, user, token }) {
      if (token.user) {
        /** Send properties to the client, like an access_token and user id from a provider.*/
        session.user = token.user as User;
        // session.expires = token.user.exp;
        session.expires = toLocaleIso(token.user.exp * 1000);
        session.error = token.error;
        // console.log("session (session): ", session);
      }
			return session;
    },
  },
}

export default NextAuth(authOptions);

/**
 * Takes a token, and returns a new token with updated `access_token` and `access_token_expires`.
 * If an error occurs, returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
	try {
    /** use refresh_token from initial sign in to request new access_token */
		const request = new Request(`${ENTRYPOINT}/token/refresh`, {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json'}),
			body: JSON.stringify({"refresh_token":  token.refresh_token})
		});
		const response = await fetch(request);

		const refreshedTokens: AuthResponse = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		const accessTokenDecoded: User = jwt_decode(refreshedTokens.token);
    if (accessTokenDecoded) {
      token.user = accessTokenDecoded;  // refresh token.user, will be updated in session.user
      token.user.tokens = refreshedTokens;  // save refreshed tokens
    }

    const refreshed_tokens = {
			...token,   // ... : spread syntax or spread operator
			access_token: refreshedTokens.token,
			refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
			access_token_expires: accessTokenDecoded.exp * 1000,
		}

		return refreshed_tokens;
	} catch (error: any) {
		console.error("ERROR: ", error.detail);
		return {
			...token,
			error: 'RefreshAccessTokenError'
		}
	}
}

/** turn timestamp into "locale timezone iso format". */
function toLocaleIso(timestamp: number, name?: string) {
  let dateLocale = new Date(timestamp).toLocaleString("en-US", {timeZone: "Africa/Tunis"});
  let dateLocaleIso = new Date(dateLocale).toISOString();
  return dateLocaleIso;
}
