import { Outlet } from "react-router";
import { authenticator, AuthStrategyMame } from "~/utils/auth.server";
import type { Route } from "../+types/root";
import { MainNav } from "@/components/feature/main_navigation";

export async function loader({ request }: Route.LoaderArgs) {
  await authenticator.authenticate(AuthStrategyMame, request);
}

const ProtectedLayout = () => {
  return (
    <div>
      <MainNav />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
