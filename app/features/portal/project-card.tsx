import { Link } from "react-router";
import { Card } from "~/components/card";
import { ROUTE_IDS } from "~/lib/route-ids";

export type ProjectTab = "overview" | "tasks";

const TABS: {
  key: ProjectTab;
  label: string;
  path: (projectId: string) => string;
}[] = [
  {
    key: "overview",
    label: "概要",
    path: (projectId) => `/portal/projects/${projectId}`,
  },
  {
    key: "tasks",
    label: "タスク",
    path: (projectId) => `/portal/projects/${projectId}/tasks`,
  },
];

export function tabFromRouteId(routeId: string | undefined): ProjectTab {
  return routeId === ROUTE_IDS.projectTasks ? "tasks" : "overview";
}

// 見た目はタブだが実体は URL 遷移なので、ARIA の tab ではなく
// ナビゲーションとして扱い、現在地を aria-current で伝える。
// projectId を渡さない場合はリンクにせず文字だけを描く（遷移中の表示用）
function ProjectTabs({
  activeTab,
  projectId,
}: {
  activeTab: ProjectTab;
  projectId?: string;
}) {
  return (
    <nav aria-label="プロジェクト詳細" className="tabs tabs-border mb-2">
      {TABS.map((tab) => {
        const className = `tab ${tab.key === activeTab ? "tab-active" : ""}`;
        return projectId === undefined ? (
          <span key={tab.key} className={className}>
            {tab.label}
          </span>
        ) : (
          <Link
            key={tab.key}
            to={tab.path(projectId)}
            prefetch="intent"
            aria-current={tab.key === activeTab ? "page" : undefined}
            className={className}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

// プロジェクト詳細の枠。実物もスケルトンもこの枠を使うので、
// 枠を変えたときに遷移中だけ形が変わることがない。
// title を渡さない場合は見出しの位置をスケルトンにする
export function ProjectCard({
  title,
  activeTab,
  projectId,
  children,
}: {
  title?: string;
  activeTab: ProjectTab;
  projectId?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      {title === undefined ? (
        <div className="skeleton h-7 w-40 rounded" />
      ) : (
        <h2 className="card-title">{title}</h2>
      )}
      <ProjectTabs activeTab={activeTab} projectId={projectId} />
      {children}
    </Card>
  );
}
