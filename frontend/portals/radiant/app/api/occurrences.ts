import { SortBodyOrderEnum, SqonOpEnum } from "@/api/api";
import { getOccurrencesApi } from "~/utils/api.server";
import type { Route } from "./+types/occurrences";

/**
 * loader func handles GET requests
 */
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

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
