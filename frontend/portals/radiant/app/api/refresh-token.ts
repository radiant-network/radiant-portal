import type { Route } from "./+types/occurrences";
import { refreshAccessToken } from "~/utils/auth.server";

export async function action({ request }: Route.LoaderArgs) {
  const results = await refreshAccessToken(request);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": results.cookie,
    },
  });
}
