import { Link } from "react-router";

// サイドバーの項目。prefetch="intent" でホバー時に
// 行き先のモジュールと loader のデータを先読みする
export function NavButton({
  to,
  selected,
  children,
}: {
  to: string;
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className={`btn btn-sm justify-start ${selected ? "btn-primary" : "btn-ghost"}`}
    >
      {children}
    </Link>
  );
}
