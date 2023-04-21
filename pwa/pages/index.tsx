import React, { useState } from "react";

import Template from "../components/Template";
// import { useSession } from "next-auth/react";
// import { useQuery } from "react-query";
// import { User } from "next-auth";

function IndexPage() {
	/* ********************************************************************* */
	// const {user, setUser} = useState();
	// const { status, data: session } = useSession()

	/** react-query */
	// const { isLoading, error, data, isFetching } = useQuery("repoData", () => {
	// 	if (session && status === "authenticated") {
	// 		console.info("authenticated.")
			
	// 		const request = new Request(`${ENTRYPOINT}/api/users`, {
	// 			method: 'GET',
	// 			headers: new Headers({ 
	// 				'Authorization': `Bearer ${(session.user as User).tokens.token}`
	// 			}),
	// 		});

	// 		fetch(request).then(resp => resp.json())
	// 		.then((res) => {
	// 			console.log(res);
	// 			setUsers(res['hydra:member'])
	// 		})
	// 	}
	// });
	/* ********************************************************************* */

	// if (status === 'loading') {
	// 	return 'Loading or not authenticated...'
	// }

	return (
		<Template>
			<div className="container mx-auto px-4 text-lg h-screen">
				<h1>Lorem ipsum dolor sit amet</h1>
				{/* {isLoading && (
					<p>isLoading ...</p>
				)}
				{isFetching && (
					<p>isFetching ...</p>
				)} */}
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam facere sint qui ea officiis illum debitis ipsum pariatur, eveniet deleniti aliquam veniam eaque minima, accusantium deserunt beatae nihil maiores saepe.
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam maxime tempora illum vero dolores impedit reiciendis minus, nesciunt quo consequatur excepturi eveniet delectus nulla at animi aliquid nemo omnis numquam.
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur reprehenderit error iure nihil laudantium. Nesciunt sequi recusandae, voluptatem architecto cumque excepturi unde aperiam, eius quos ipsum culpa labore eligendi autem?
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia facere facilis eligendi excepturi placeat necessitatibus eos cum rem dolorum pariatur culpa, voluptates error sint tenetur nihil magnam in, libero alias.
				</p>
			</div>
		</Template>
	)
}

export default IndexPage;
