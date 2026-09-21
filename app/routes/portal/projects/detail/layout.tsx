import { Outlet } from "react-router";
import { ErrorCard } from "~/components/card";
import { unstable_useRouterState as useRouterState } from "react-router";
import { type RouteHandle, usePendingScope } from "~/features/portal/handle";
import { ProjectCard, tabFromRouteId } from "~/features/portal/project-card";
import { ScopeSkeleton } from "~/features/portal/skeleton";
import { getProjectName } from "~/data/projects";
import { ROUTE_IDS } from "~/lib/route-ids";
import type { Route } from "./+types/layout";

export const handle = {
  title: "プロジェクト詳細",
  breadcrumb: "詳細",
  contentWidth: "full",
  skeleton: "card",
} satisfies RouteHandle;

// 見出し用に名前だけを即時取得する。重い取得は子ルートの loader 側
export async function loader({ params }: Route.LoaderArgs) {
  const name = getProjectName(params.projectId);
  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }
  return { name };
}

export default function ProjectDetailLayout({
  loaderData,
}: Route.ComponentProps) {
  const { name } = loaderData;
  const { active, pending } = useRouterState();
  const { isOutletPending, skeleton } = usePendingScope(
    ROUTE_IDS.projectDetail,
  );

  // タブのハイライトは pending.matches を優先し、遷移確定前に切り替える
  const matches = pending?.matches ?? active.matches;
  const activeTab = tabFromRouteId(matches[matches.length - 1]?.id);

  return (
    <ProjectCard
      title={name}
      activeTab={activeTab}
      projectId={active.params.projectId}
    >
      {isOutletPending ? (
        <ScopeSkeleton kind={skeleton} project={{ name, activeTab }} />
      ) : (
        <Outlet />
      )}
    </ProjectCard>
  );
}

// ルート単位の ErrorBoundary。見つからないプロジェクトIDのときここに落ちる
export function ErrorBoundary() {
  return <ErrorCard />;
}
