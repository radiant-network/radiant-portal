import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout/protected-layout.tsx", [
    index("./routes/home.tsx"),
    route("admin/features", "./routes/admin/beta-features.tsx"),
  ]),
  route("auth/callback", "./routes/auth/callback.ts"),
  route("auth/logout", "./routes/auth/logout.ts"),
  route("auth/refresh-token", "./api/refresh-token.ts"),
  ...prefix("api", [
    route("*?", "./api/proxy.ts"),
  ]),
] satisfies RouteConfig;
