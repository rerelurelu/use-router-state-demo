// プロジェクト画面の「一覧 + 詳細」の2カラム。
// 実物もスケルトンもこの枠を使うので、カラム幅を変えたときに
// 遷移中だけレイアウトが変わることがない。
// portal/layout.tsx が既に main を描いているので、ここは div にする
export function ProjectsColumns({
  list,
  children,
}: {
  list: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-6">
      <aside className="flex flex-col gap-2">{list}</aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
