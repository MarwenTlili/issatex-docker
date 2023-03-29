import { useSession } from 'next-auth/react';
import React from 'react';

const ProtectedPage = () => {
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			// The user is not authenticated, handle it here.
		},
	});

	if (status === 'loading') {
		return 'Loading or not authenticated...'
	}
	
	return (
		<div>
			<h1>protected page</h1>
		</div>
	);
};

export default ProtectedPage;