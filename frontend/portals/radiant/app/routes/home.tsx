import Variant from "variant/App";
import { getOccurrencesApi } from "~/utils/api.server";
import {
  SortBodyOrderEnum,
  SqonOpEnum,
  type Occurrence,
} from "../../../../api";
import type { Route } from "../routes/+types/home";
import { useLoaderData } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 0);
  const limit = Number(url.searchParams.get("limit") || 20);

  const occurenceApi = await getOccurrencesApi(request);

  try {
    const response = await occurenceApi.listOccurrences("5011", {
      selected_fields: ["hgvsg", "variant_class"],
      limit: limit,
      offset: page * limit,
      sort: [
        {
          field: "pf",
          order: SortBodyOrderEnum.Asc,
        },
      ],
      sqon: {
        field: "impact_score",
        op: SqonOpEnum.In,
        value: [4],
      },
    });

    return {
      occurrences: response.data,
      error: null,
    };
  } catch (error: any) {
    return {
      occurrences: [],
      error: error.message,
    };
  }
}

const Home = () => {
  const data = useLoaderData<{
    occurrences: Occurrence[];
    error: string | null;
  }>();

  return (
    <main className="flex p-4">
      <Variant data={data.occurrences} />
    </main>
  );
};

export default Home;
