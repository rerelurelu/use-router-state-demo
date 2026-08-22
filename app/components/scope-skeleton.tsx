// 差し替え対象のスケルトン
export function ScopeSkeleton({ kind }: { kind: "card" | "table" | "list" }) {
  return (
    // role="status" は aria-live="polite" を暗黙に持つ。遷移中に中身が
    // 差し替わったことをスクリーンリーダーへ伝える
    <div
      role="status"
      className="rounded border-2 border-dashed border-primary/40 p-4"
    >
      <p className="mb-2 text-xs text-primary/70">この範囲が差し替わります</p>
      {kind === "card" && <CardSkeleton />}
      {kind === "table" && <TableSkeleton />}
      {kind === "list" && <ListSkeleton />}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton h-6 w-48 rounded" />
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

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton h-12 w-full rounded" />
      ))}
    </div>
  );
}
