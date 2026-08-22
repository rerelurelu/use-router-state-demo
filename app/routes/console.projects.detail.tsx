import { Link, Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { ScopeSkeleton } from "~/components/scope-skeleton";
import { getProjectName } from "~/data/projects";
import { type RouteHandle, usePendingScope } from "~/lib/pending-scope";
import type { Route } from "./+types/console.projects.detail";

const ROUTE_ID = "routes/console.projects.detail";
const OVERVIEW_ROUTE_ID = "routes/console.projects.detail.overview";
const TASKS_ROUTE_ID = "routes/console.projects.detail.tasks";

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
  const { isOutletPending, skeleton } = usePendingScope(ROUTE_ID);

  const matches = pending?.matches ?? active.matches;
  const leafId = matches[matches.length - 1]?.id;

  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>

        {/* 見た目はタブだが実体は URL 遷移なので、ARIA の tab ではなく
            ナビゲーションとして扱い、現在地を aria-current で伝える */}
        <nav aria-label="プロジェクト詳細" className="tabs tabs-border mb-2">
          <Link
            to={`/console/projects/${active.params.projectId}`}
            aria-current={leafId === OVERVIEW_ROUTE_ID ? "page" : undefined}
            className={`tab ${leafId === OVERVIEW_ROUTE_ID ? "tab-active" : ""}`}
          >
            概要
          </Link>
          <Link
            to={`/console/projects/${active.params.projectId}/tasks`}
            aria-current={leafId === TASKS_ROUTE_ID ? "page" : undefined}
            className={`tab ${leafId === TASKS_ROUTE_ID ? "tab-active" : ""}`}
          >
            タスク
          </Link>
        </nav>

        {isOutletPending ? <ScopeSkeleton kind={skeleton} /> : <Outlet />}
      </div>
    </div>
  );
}

// ルート単位の ErrorBoundary。見つからないプロジェクトIDのときここに落ちる
export function ErrorBoundary() {
  return (
    <div className="card border border-error bg-base-100 shadow">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-error">読み込みに失敗しました</h2>
          <span className="badge badge-error badge-sm">エラー</span>
        </div>
      </div>
    </div>
  );
}
