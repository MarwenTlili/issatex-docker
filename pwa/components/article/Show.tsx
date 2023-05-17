import { FunctionComponent, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { Article } from "../../types/Article";
import Template from "../Template";
import Link from "next/link";

interface Props {
	article: Article;
	text: string;
}

export const Show: FunctionComponent<Props> = ({ article, text}) => {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	
	const handleDelete = async () => {
		if (!article["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;

		try {
			await fetch(article["@id"], { method: "DELETE" });
			router.push("/articles");
		} catch (error) {
			setError("Error when deleting the resource.");
			console.error(error);
		}
	};

	return (
		<>
			<Head>
				<title>{`Show Article ${article["@id"]}`}</title>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			</Head>
			<Template>
				<div className="flex flex-col items-center justify-start h-screen p-4 mt-8">

					<div className="grid place-content-center font-mono text-2xl">
						{`Article ${article["designation"]}`}
					</div>
					
					<div className="w-full md:w-4/5 p-4">

						<div className="flex flex-row justify-end">
							<Link
								href={getItemPath(article["@id"], "/articles/[id]/edit")}
								className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
							>
								Edit
							</Link>
							<button
								onClick={handleDelete}
								className="font-mono text-lg text-red-500 hover:text-indigo-800 ml-2"
							>
								Delete
							</button>
						</div>

						<div className="grid place-content-start">
							<div className="flex flex-col pb-8">
								<div className="font-bold">Designation</div>
								<div>{article["designation"]}</div>
							</div>
							<div className="flex flex-col pb-8">
								<div className="font-bold">Model</div>
								<div>{article["model"]}</div>
							</div>
							<div className="flex flex-col pb-8">
								<div className="font-bold">Composition</div>
								<div>{article["composition"]}</div>
							</div>
						</div>

					</div>

				</div>
			</Template>
		</>
	);
};
