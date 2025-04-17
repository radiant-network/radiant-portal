import type { Route } from "../+types/home";
import { logout, requireAuth } from "~/utils/auth.server";
import HiddenFeaturesAdmin from "@/components/feature/admin/beta-features";

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return logout(request);
  }
}

const HiddenFeatures = () => {
  return <HiddenFeaturesAdmin />;
};

export default HiddenFeatures;
