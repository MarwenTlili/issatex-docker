import jwtDecode from 'jwt-decode';
import { ENTRYPOINT } from '../config/entrypoint';
import { AuthProvider } from 'react-admin';
import decodeJwt from 'jwt-decode';
import { FormData } from '../components/admin/LoginForm';

const authProvider: AuthProvider = {
	login: async (credentials: FormData) => {
		// change 'email' with the identifier set in JWT token payload
		const credentialsProps = {email: credentials.username, password: credentials.password}

		const request = new Request(`${ENTRYPOINT}/auth`, {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json'}),
			body: JSON.stringify(credentialsProps)
		});

		return fetch(request)
			.then( (response) => {
				if (response.status < 200 || response.status >= 300) {
					throw new Error(response.statusText);
				}
				return response.json();
			} )
			.then(({ token }) => {
				const decodedToken: Token = decodeJwt(token);
				// const roles = decodedToken.roles;
				const isAdmin = decodedToken.roles.includes('ROLE_ADMIN');
				
				if (!isAdmin) {
					throw new Error('Only admins can access this page!');
				}
				
				localStorage.setItem('token', token);
				// localStorage.setItem('', decodedToken.permissions);
			});
	},

	logout: () => {
		localStorage.removeItem('token');
		return Promise.resolve();
	},

	checkAuth: () => {
		try {
			if (
				!localStorage.getItem('token') || new Date().getTime() / 1000 >
				// @ts-ignore
				jwtDecode(localStorage.getItem('token'))?.exp
			) {
				return Promise.reject();
			}
			return Promise.resolve();
		} catch (e) {
			// override possible jwtDecode error
			return Promise.reject();
		}
	},

	checkError: (err: { status: any; response: { status: any; }; }) => {
		if ([401, 403].includes(err?.status || err?.response?.status)) {
			localStorage.removeItem('token');
			return Promise.reject();
		}
		return Promise.resolve();
	},

	getPermissions: () => Promise.resolve(),
};

export default authProvider;

// describe JWT token payload provided by back-end RestAPI
interface Token {
	iat: number;
	exp: number;
	roles: Array<string>,
	email: string,
	username: string,
	avatar: string,
	ip: string
}