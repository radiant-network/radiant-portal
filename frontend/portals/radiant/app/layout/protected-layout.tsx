import { Outlet, useLoaderData, useNavigate } from "react-router";
import {
  authenticateRequest,
  getSessionUser,
  requireAuth,
} from "~/utils/auth.server";
import type { Route } from "../+types/root";
import { MainNav } from "@/components/feature/main_navigation";
import type { IAuthUser } from "~/utils/auth.types";

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    await authenticateRequest(request);
  } else {
    return await getSessionUser(request);
  }
}

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const data = useLoaderData<IAuthUser>();

  return (
    <div>
      <MainNav
        userName={data.preferred_username}
        onLogout={() => navigate("/auth/logout")}
      />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
