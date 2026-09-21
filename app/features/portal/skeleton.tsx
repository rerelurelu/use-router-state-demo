import type { SkeletonKind } from "./handle";
import { ProjectCard, type ProjectTab } from "./project-card";
import { ProjectsColumns } from "./projects-columns";

// 遷移前から分かっているプロジェクトの情報。card と split の枠で使う。
// name は一覧の loader が返した値、activeTab は pending.matches の末尾から決まる
type PendingProject = {
  name?: string;
  activeTab: ProjectTab;
};

// 差し替え対象のスケルトン。kind は差し替わるルートの handle が決める
export function ScopeSkeleton({
  kind,
  project,
}: {
  kind: SkeletonKind;
  project?: PendingProject;
}) {
  const activeTab = project?.activeTab ?? "overview";
  const card = (
    <ProjectCard title={project?.name} activeTab={activeTab}>
      <BodySkeleton />
    </ProjectCard>
  );

  const byKind: Record<SkeletonKind, React.ReactNode> = {
    card,
    split: <ProjectsColumns list={<ListSkeleton height="h-8" />}>{card}</ProjectsColumns>,
    table: <TableSkeleton />,
    list: <ListSkeleton height="h-12" />,
  };

  return (
    // role="status" は aria-live="polite" を暗黙に持つ。遷移中に中身が
    // 差し替わったことをスクリーンリーダーへ伝える
    <div role="status">
      <span className="sr-only">読み込み中</span>
      {byKind[kind]}
    </div>
  );
}

// プロジェクト詳細カードの中身。遷移後に入るのは概要の定義リストか
// タスクの表で、どちらも数行なので同じ形でよい
function BodySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton h-5 w-1/3 rounded" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-8 w-full rounded" />
      ))}
    </div>
  );
}

function ListSkeleton({ height }: { height: string }) {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`skeleton ${height} rounded`} />
      ))}
    </div>
  );
}
