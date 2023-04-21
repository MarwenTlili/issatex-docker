import { useRouter } from 'next/router';
import React from 'react';

const Error = () => {
	const router = useRouter()
	const {error} = router.query

	return (
		<div>
			<h1>
				Oops! ERROR
			</h1>

			{error && (
				<p>{error}</p>
			)}
		</div>
	);
};

export default Error;