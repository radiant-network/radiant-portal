import { SortBodyOrderEnum, SqonOpEnum } from "@/api/api";
import { getOccurrencesApi } from "~/utils/api.server";
import type { Route } from "./+types/occurrences";

/**
 * loader func handles GET requests
 */
export async function loader({ request }: Route.LoaderArgs) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * action func handles everything else
 */
export function action({ request }: Route.ActionArgs) {
  switch (request.method) {
    case "PUT":
      return Response.json({
        message: "PUT",
      });
    case "PATCH":
      return Response.json({
        message: "PATCH",
      });
    case "POST":
      return Response.json({
        message: "POST",
      });
    case "DELETE":
      return Response.json({
        message: "DELETE",
      });
  }
}
