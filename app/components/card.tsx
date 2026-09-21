// daisyUI のカード。枠と余白の指定をここ 1 箇所に置く
export function Card({
  as: Tag = "div",
  id,
  bodyClassName = "",
  children,
}: {
  as?: "div" | "section";
  id?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id} className="card border border-base-300 bg-base-100 shadow">
      <div className={`card-body ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}

// loader が失敗した階層に描くカード。親のレイアウトは生き残る
export function ErrorCard() {
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
