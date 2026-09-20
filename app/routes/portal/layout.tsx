import { Link, Outlet } from "react-router";
import { NavButton } from "~/components/nav-button";
import { BackLink } from "~/components/page-shell";
import { unstable_useRouterState as useRouterState } from "react-router";
import { StateInspector } from "~/components/state-inspector";
import {
  type RouteHandle,
  WIDTH_CLASS,
  usePendingBreadcrumbs,
  usePendingHandle,
  usePendingScope,
} from "~/features/portal/handle";
import { tabFromRouteId } from "~/features/portal/project-card";
import { ScopeSkeleton } from "~/features/portal/skeleton";
import { ROUTE_IDS } from "~/lib/route-ids";

export const handle = {
  title: "社内ポータル",
  breadcrumb: "社内ポータル",
  contentWidth: "full",
} satisfies RouteHandle;

const NAV = [
  { to: "/portal/projects", label: "プロジェクト", routeId: ROUTE_IDS.projects },
  { to: "/portal/reports", label: "レポート", routeId: ROUTE_IDS.reports },
  { to: "/portal/settings", label: "設定", routeId: ROUTE_IDS.settings },
];

export default function PortalLayout() {
  const { active, pending } = useRouterState();
  const chrome = usePendingHandle();
  const breadcrumbs = usePendingBreadcrumbs();
  const { isOutletPending, skeleton } = usePendingScope(ROUTE_IDS.portal);

  // ナビのハイライトは pending.matches を優先し、遷移確定前に切り替える
  const matches = pending?.matches ?? active.matches;
  const activeTab = tabFromRouteId(matches[matches.length - 1]?.id);

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-[220px] shrink-0 border-r border-base-300 bg-base-100 p-4">
        <div className="mb-1 text-lg font-bold">社内ポータル</div>
        <BackLink className="mb-6 block text-xs opacity-60" />
        <nav className="flex flex-col gap-2">
          {NAV.map((item) => (
            <NavButton
              key={item.to}
              to={item.to}
              selected={matches.some((m) => m.id === item.routeId)}
            >
              {item.label}
            </NavButton>
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
            {isOutletPending ? (
              <ScopeSkeleton kind={skeleton} project={{ activeTab }} />
            ) : (
              <Outlet />
            )}
          </div>

          <StateInspector fields={["matches"]} />
        </main>
      </div>
    </div>
  );
}
