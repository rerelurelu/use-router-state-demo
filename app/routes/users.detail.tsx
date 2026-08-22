import { Outlet } from "react-router";
import { getUserName } from "~/data/users";
import type { Route } from "./+types/users.detail";

// 見出し用に名前だけを即時取得する。重い取得・失敗は子ルートの loader 側
export async function loader({ params }: Route.LoaderArgs) {
  const name = getUserName(params.userId);
  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }
  return { name };
}

export default function UserDetailLayout({
  loaderData,
}: Route.ComponentProps) {
  const { name } = loaderData;

  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <Outlet />
      </div>
    </div>
  );
}

// ルート単位の ErrorBoundary。失敗してもこの位置にだけ描画され、
// 親レイアウト（サイドバー・選択状態）はそのまま生き残る
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
