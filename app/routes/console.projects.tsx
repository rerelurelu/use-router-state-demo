import { Link, Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { ScopeSkeleton } from "~/components/scope-skeleton";
import { getProjectList } from "~/data/projects";
import { type RouteHandle, usePendingScope } from "~/lib/pending-scope";
import type { Route } from "./+types/console.projects";

const ROUTE_ID = "routes/console.projects";

export const handle = {
  title: "プロジェクト",
  breadcrumb: "プロジェクト",
  contentWidth: "full",
  skeleton: "card",
} satisfies RouteHandle;

// 一覧API。遅延なし
export async function loader() {
  return { projects: getProjectList() };
}

export default function ProjectsLayout({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const { active, pending } = useRouterState();
  const { isOutletPending, skeleton } = usePendingScope(ROUTE_ID);

  const selectedProjectId = pending?.params.projectId ?? active.params.projectId;

  return (
    <div className="grid grid-cols-[160px_1fr] gap-6">
      <aside className="flex flex-col gap-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/console/projects/${p.id}`}
            className={`btn btn-sm justify-start ${
              p.id === selectedProjectId ? "btn-primary" : "btn-ghost"
            }`}
          >
            {p.name}
          </Link>
        ))}
      </aside>

      <main className="min-w-0">
        {isOutletPending ? <ScopeSkeleton kind={skeleton} /> : <Outlet />}
      </main>
    </div>
  );
}
