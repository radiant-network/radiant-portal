import Variant from "variant/App";
import type { Route } from "./+types/home";
import { logout, requireAuth } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return logout(request);
  }
}

const Home = () => {
  return <Variant />;
};

export default Home;
