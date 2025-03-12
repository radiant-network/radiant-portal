import Variant from "variant/App";
import type { Route } from "./+types/home";
import { logout, requireAuth } from "~/utils/auth.server";
import {
  ConfigProvider,
  type PortalConfig,
} from "@/components/model/applications-config";
declare const __PROJECT__: PortalConfig;

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return logout(request);
  }
}
const Home = () => {
  const config = __PROJECT__;
  return (
    <ConfigProvider config={config}>
      <Variant />
    </ConfigProvider>
  );
};

export default Home;
