import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout/protected-layout.tsx", [index("./routes/home.tsx")]),
  route("auth/callback", "./routes/auth/callback.ts"),
] satisfies RouteConfig;
