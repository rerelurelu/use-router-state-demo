import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("users", "routes/users.tsx", [
    index("routes/users.index.tsx"),
    route(":userId", "routes/users.detail.tsx", [
      index("routes/users.detail.profile.tsx"),
    ]),
  ]),
  route("steps", "routes/steps.tsx", [
    index("routes/steps.index.tsx"),
    route(":step", "routes/steps.step.tsx"),
  ]),
  route("console", "routes/console.tsx", [
    index("routes/console.index.tsx"),
    route("projects", "routes/console.projects.tsx", [
      index("routes/console.projects.index.tsx"),
      route(":projectId", "routes/console.projects.detail.tsx", [
        index("routes/console.projects.detail.overview.tsx"),
        route("tasks", "routes/console.projects.detail.tasks.tsx"),
      ]),
    ]),
    route("reports", "routes/console.reports.tsx"),
    route("settings", "routes/console.settings.tsx"),
  ]),
] satisfies RouteConfig;
