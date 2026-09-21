import { Outlet } from "react-router";
import { NavButton } from "~/components/nav-button";
import { unstable_useRouterState as useRouterState } from "react-router";
import { type RouteHandle, usePendingScope } from "~/features/portal/handle";
import { tabFromRouteId } from "~/features/portal/project-card";
import { ProjectsColumns } from "~/features/portal/projects-columns";
import { ScopeSkeleton } from "~/features/portal/skeleton";
import { getProjectList } from "~/data/projects";
import { ROUTE_IDS } from "~/lib/route-ids";
import type { Route } from "./+types/layout";

export const handle = {
  title: "プロジェクト",
  breadcrumb: "プロジェクト",
  contentWidth: "full",
  skeleton: "split",
} satisfies RouteHandle;

export async function loader() {
  return { projects: getProjectList() };
}

export default function ProjectsLayout({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const { active, pending } = useRouterState();
  const { isOutletPending, skeleton } = usePendingScope(ROUTE_IDS.projects);

  const selectedProjectId = pending?.params.projectId ?? active.params.projectId;
  // 一覧の loader で名前は取得済みなので、遷移先の詳細を待たずに見出しへ出せる。
  // 開くタブも pending.matches の末尾から決まる
  const pendingProject = pending
    ? {
        name: projects.find((p) => p.id === pending.params.projectId)?.name,
        activeTab: tabFromRouteId(
          pending.matches[pending.matches.length - 1]?.id,
        ),
      }
    : undefined;

  return (
    <ProjectsColumns
      list={projects.map((p) => (
        <NavButton
          key={p.id}
          to={`/portal/projects/${p.id}`}
          selected={p.id === selectedProjectId}
        >
          {p.name}
        </NavButton>
      ))}
    >
      {isOutletPending ? (
        <ScopeSkeleton kind={skeleton} project={pendingProject} />
      ) : (
        <Outlet />
      )}
    </ProjectsColumns>
  );
}
