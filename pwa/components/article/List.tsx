import { FunctionComponent } from "react";

// import ReferenceLinks from "../common/ReferenceLinks";
import { getItemPath } from "../../utils/dataAccess";
import { Article } from "../../types/Article";
import Link from "next/link";
import Image from "next/image";

interface ListProps {
	articles: Article[];
}

export const List: FunctionComponent<ListProps> = ({ articles }) => (
	<div className="w-full p-2">
		<div className="flex">
			<Link
				href="/articles/create"
				className="font-mono text-lg text-cyan-600 hover:text-indigo-800"
			>
				Create
			</Link>
		</div>
		<p>total articles: {articles.length}</p>
		<div className="grid grid-cols-1 gap-1 place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-4 ">
			{articles &&
				articles.length !== 0 &&
				articles.map( (article, id) =>
					article["@id"] && (
						<div key={article["@id"]} 
							className="max-w-sm bg-white border border-gray-200 rounded-lg shadow p-2 m-2">
							<a href={getItemPath(article["@id"], "/articles/[id]")}>
								<Image className="rounded-t-lg" 
									src={"https://picsum.photos/id/" + id + "/500/200"}
									width={500}
									height={200}
									alt={article["designation"] || ""} />
							</a>
							<div className="p-5">
								<a href={getItemPath(article["@id"], "/articles/[id]")}>
									<h5 className="mb-2 text-xl font-mono tracking-tight text-gray-900 hover:text-indigo-800">
										{article["designation"]}
									</h5>
								</a>
								<div className="mb-3 text-lg font-mono text-gray-700 py-2 ">
									<p className="line-clamp-3">
										{article["composition"]}
									</p>
								</div>
								<Link
									href={getItemPath(article["@id"], "/articles/[id]")}
									className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
								>
									Show
								</Link>
								<Link
									href={getItemPath(article["@id"], "/articles/[id]/edit")}
									className="font-mono text-lg text-orange-800/100 hover:text-indigo-800 ml-2"
								>
									Edit
								</Link>
							</div>
						</div>
					)
				)
			}
			
		</div>
	</div>
);
