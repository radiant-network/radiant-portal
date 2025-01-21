import { login, requireAuth } from "~/utils/auth.server";
import type { Route } from "./+types/callback";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return await login(request);
  } else {
    return redirect("/");
  }
}
