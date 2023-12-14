import {
    NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Show } from "../../../components/article/Show";
import { Article } from "../../../types/Article";
import { fetch, FetchResponse } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getArticle = async (id: string | string[] | undefined) =>
    id
        ? await fetch<Article>(`/api/articles/${id}`)
        : Promise.resolve(undefined);

const Page: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const {
        data: { data: article, hubURL, text } = { hubURL: null, text: "" }
    } = useQuery<FetchResponse<Article> | undefined>(
        ["article", id], () => getArticle(id)
    );
    const articleData = useMercure(article, hubURL);

    if (!articleData) {
        // return <DefaultErrorPage statusCode={404} />;
        return <>loading ...</>
    }

    return (
        <div>
            <div>
                <Head>
                    <title>{`Show Article ${articleData["@id"]}`}</title>
                </Head>
            </div>
            <Show article={articleData} text={text} />
        </div>
    );
};

export default Page;
