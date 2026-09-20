import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("guide", "routes/guide.tsx"),
  route("users", "routes/users/layout.tsx", [
    index("routes/users/index.tsx"),
    route(":userId", "routes/users/detail/layout.tsx", [
      index("routes/users/detail/profile.tsx"),
    ]),
  ]),
  route("steps", "routes/steps/layout.tsx", [
    index("routes/steps/index.tsx"),
    route(":step", "routes/steps/step.tsx"),
  ]),
  route("portal", "routes/portal/layout.tsx", [
    index("routes/portal/index.tsx"),
    route("projects", "routes/portal/projects/layout.tsx", [
      index("routes/portal/projects/index.tsx"),
      route(":projectId", "routes/portal/projects/detail/layout.tsx", [
        index("routes/portal/projects/detail/overview.tsx"),
        route("tasks", "routes/portal/projects/detail/tasks.tsx"),
      ]),
    ]),
    route("reports", "routes/portal/reports.tsx"),
    route("settings", "routes/portal/settings.tsx"),
  ]),
] satisfies RouteConfig;
