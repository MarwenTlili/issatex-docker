import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { ProductionDate } from "../../types/ProductionDate";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getProductionDatesPath = (page?: string | string[] | undefined) =>
  `/api/production_dates${typeof page === "string" ? `?page=${page}` : ""}`;
export const getProductionDates =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<ProductionDate>>(getProductionDatesPath(page));
const getPagePath = (path: string) =>
  `/productiondates/page/${parsePage("api/production_dates", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: productiondates, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<ProductionDate>> | undefined>(
      getProductionDatesPath(page),
      getProductionDates(page)
    );
  const collection = useMercure(productiondates, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>ProductionDate List</title>
        </Head>
      </div>
      <List productiondates={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
