import { Dispatch, FunctionComponent, SetStateAction } from "react"
import { getItemPath } from "../../utils/dataAccess"
import { Article } from "../../types/Article"
import Link from "next/link"
import ImageElement from "./ImageElement"

export const ARTICLES_ITEMS_PER_PAGE = ["5", "10", "20", "30"]

interface Props {
    articles: Article[]
    totalItems?: number | undefined
    perPage: string
    setPerPage: Dispatch<SetStateAction<string>>
}

export const List: FunctionComponent<Props> = ({ articles, totalItems, perPage, setPerPage }) => {
    return (
        <div className="container p-4">
            <div className="flex">
                <Link
                    href="/articles/create"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
                >
                    Create
                </Link>
            </div>

            <div className="block sm:flex sm:justify-between sm:items-center">
                <p className="pt-2">Articles {articles.length} / {totalItems}</p>
                <p className="pt-2">
                    <span>items per page</span>
                    <select name="perPage" id="perPage"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1 ml-1 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        value={perPage}
                        onChange={(event) => {
                            if (event.target.value) {
                                setPerPage(event.target.value)
                            }
                        }}>
                        {ARTICLES_ITEMS_PER_PAGE.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </p>
            </div>

            <div className="grid grid-cols-1 gap-1 place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-4 ">
                {articles &&
                    articles.length !== 0 &&
                    articles.map((article, id) =>
                        article["@id"] && (
                            <div key={article["@id"]}
                                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow p-2 m-2">
                                <a href={getItemPath(article["@id"], "/articles/[id]")} className="flex justify-center">
                                    <ImageElement key={article.id} id={article.image} />
                                </a>
                                <div className="p-5">
                                    <a href={getItemPath(article["@id"], "/articles/[id]")}>
                                        <h5 className="line-clamp-3 mb-2 text-xl font-mono tracking-tight text-gray-900 hover:text-indigo-800">
                                            {article["designation"]}
                                        </h5>
                                    </a>
                                    <div className="mb-3 text-lg font-mono text-gray-700 py-2 ">
                                        <div className="prose max-w-full line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: article.composition ?? "" }}
                                        />
                                    </div>
                                    <Link
                                        href={getItemPath(article["@id"], "/articles/[id]")}
                                        className="font-mono text-lg text-cyan-600/100 hover:text-indigo-800"
                                    >
                                        Show
                                    </Link>
                                    {article && article.manufacturingOrders?.length === 0 && (
                                        <Link
                                            href={getItemPath(article["@id"], "/articles/[id]/edit")}
                                            className="font-mono text-lg text-orange-800/100 hover:text-indigo-800 ml-2"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}
