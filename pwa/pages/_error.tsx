import { ReactElement } from 'react';
import { ServerResponse } from 'http';

/**
 * pages/_error.js is only used in production. In development you’ll get an 
 * error with the call stack to know where the error originated from.
 * @param statusCode: number 
 * @returns ReactElement
 */
const Error = ({ statusCode }: {statusCode: number}): ReactElement => {
	return (
		<p>
			{statusCode
				? `An error ${statusCode} occurred on server`
				: 'An error occurred on client'}
		</p>
	);
};

Error.getInitialProps = ({ res, err }: {res: any, err: ServerResponse}) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
}

export default Error;
