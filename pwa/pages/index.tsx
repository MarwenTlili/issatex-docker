import React, {
  useEffect,
  // useState 
} from "react";

import Template from "../components/Template";
import { signOut, useSession } from "next-auth/react";
// import { useQuery } from "react-query";
// import { User } from "next-auth";
// import { ENTRYPOINT } from "../config/entrypoint";

// interface ApiError {
//   message: string;
// }

function IndexPage() {
	const { status, data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // signIn() // Force sign in to hopefully resolve error
      signOut();
    }
  }, [session])

	/* ********************************************************************* */
	/** example of using react-query */
  // const [users, setUsers] = useState();

	// const { isLoading, error, data, isFetching } = useQuery<void, ApiError, void, "repoData">("repoData", () => {
	// 	if (session && status === "authenticated") {
	// 		const request = new Request(`${ENTRYPOINT}/api/users`, {
	// 			method: 'GET',
	// 			headers: new Headers({
	// 				'Authorization': `Bearer ${(session.user as User).tokens.token}`
	// 			}),
	// 		});
	// 		fetch(request).then(resp => {
  //       if (resp['status'] != 200) {
  //         return resp;
  //       }
  //       return resp.json();
  //     })
  //       .then((resp) => {
  //         if (resp['status'] == 200) {
  //           setUsers(resp['hydra:member']);
  //         }
  //       });
	// 	}
	// });

  // if (error) return 'An error has occurred: ' + error.message;
	/* ********************************************************************* */

	if (status === 'loading') {
		return 'Loading ...'
	}

	return (
		<Template>
			<div className="container mx-auto px-4 text-lg h-screen">
				{session && (
          <>
            <p>
              <b>welcome { session.user.username }</b>
            </p>
          </>
        )}
				<h1>Lorem ipsum dolor sit amet</h1>
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
