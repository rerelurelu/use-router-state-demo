import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("users", "routes/users.tsx", [
    index("routes/users.index.tsx"),
    route(":userId", "routes/users.detail.tsx", [
      index("routes/users.detail.profile.tsx"),
      route("activity", "routes/users.detail.activity.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
