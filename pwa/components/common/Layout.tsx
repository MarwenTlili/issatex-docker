import { ReactNode, useState } from "react";
import {
	DehydratedState,
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from "react-query";

/**
 * 
 * @param children: JSX.Element
 * @param dehydratedState: DehydratedState (react-query)
 * @returns JSX.Element
 * dehydratedState? should be optional to no prevent worning when children 
 * daesn't have dehydratedState e.g components/artile/Show
 */
const Layout = ({
	children,
	dehydratedState,
}: {
	children: ReactNode;
	dehydratedState?: DehydratedState | null;
}) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState}>{children}</Hydrate>
		</QueryClientProvider>
	);
};

export default Layout;
