import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout/protected-layout.tsx", [index("./routes/home.tsx")]),
  route("auth/callback", "./routes/auth/callback.ts"),
  route("auth/logout", "./routes/auth/logout.ts"),
] satisfies RouteConfig;
