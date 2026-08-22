import { Link, Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { ScopeSkeleton } from "~/components/scope-skeleton";
import {
  type RouteHandle,
  usePendingBoundary,
  usePendingBreadcrumbs,
  usePendingHandle,
  usePendingScope,
} from "~/lib/pending-scope";

const ROUTE_ID = "routes/console";

export const handle = {
  title: "コンソール",
  breadcrumb: "コンソール",
  contentWidth: "full",
  skeleton: "card",
} satisfies RouteHandle;

const WIDTH_CLASS: Record<Required<RouteHandle>["contentWidth"], string> = {
  narrow: "max-w-2xl",
  full: "",
};

const NAV = [
  { to: "/console/projects", label: "プロジェクト", routeId: "routes/console.projects" },
  { to: "/console/reports", label: "レポート", routeId: "routes/console.reports" },
  { to: "/console/settings", label: "設定", routeId: "routes/console.settings" },
];

export default function ConsoleLayout() {
  const { active, pending } = useRouterState();
  const chrome = usePendingHandle();
  const breadcrumbs = usePendingBreadcrumbs();
  const { isOutletPending, skeleton } = usePendingScope(ROUTE_ID);
  const boundary = usePendingBoundary();

  // ナビのハイライトは pending.matches を優先し、遷移確定前に切り替える
  const matches = pending?.matches ?? active.matches;
  const activeIds = new Set(matches.map((m) => m.id));

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-[220px] shrink-0 border-r border-base-300 bg-base-100 p-4">
        <div className="mb-1 text-lg font-bold">Console</div>
        <Link to="/" className="link link-hover mb-6 block text-xs opacity-60">
          ← トップに戻る
        </Link>
        <nav className="flex flex-col gap-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`btn btn-sm justify-start ${
                activeIds.has(item.routeId) ? "btn-primary" : "btn-ghost"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100 px-6 py-3">
          <div className="breadcrumbs text-sm">
            <ul>
              {breadcrumbs.map((crumb, i) =>
                i === breadcrumbs.length - 1 ? (
                  <li key={crumb.id}>
                    <span>{crumb.label}</span>
                  </li>
                ) : (
                  <li key={crumb.id}>
                    <Link to={crumb.pathname}>{crumb.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <h1 className="text-xl font-bold">{chrome.title}</h1>
        </header>

        <main className="flex-1 p-6">
          <div
            className={`transition-[max-width] duration-300 ${WIDTH_CLASS[chrome.contentWidth]}`}
          >
            {isOutletPending ? <ScopeSkeleton kind={skeleton} /> : <Outlet />}
          </div>

          <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium">
              useRouterState の中身を見る
            </summary>
            <div className="collapse-content">
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(
                  {
                    activeMatchIds: active.matches.map((m) => m.id),
                    pendingMatchIds: pending
                      ? pending.matches.map((m) => m.id)
                      : null,
                    boundary,
                    resolvedHandle: chrome,
                    breadcrumbs,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </details>
        </main>
      </div>
    </div>
  );
}
