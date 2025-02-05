import { HttpStatusCode } from "axios";
import type { Route } from "./+types/occurrences";
import { refreshAccessToken } from "~/utils/auth.server";

export async function action({ request }: Route.LoaderArgs) {
  if (request.method === "POST") {
    const results = await refreshAccessToken(request);

    return new Response(JSON.stringify({ success: true }), {
      status: HttpStatusCode.Ok,
      headers: {
        "Set-Cookie": results.cookie,
      },
    });
  }

  return new Response(null, { status: HttpStatusCode.MethodNotAllowed });
}
