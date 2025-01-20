import { authenticator, AuthStrategyMame } from "~/utils/auth.server";
import type { Route } from "./+types/callback";

export async function loader({ request }: Route.LoaderArgs) {
  await authenticator.authenticate(AuthStrategyMame, request);
}
