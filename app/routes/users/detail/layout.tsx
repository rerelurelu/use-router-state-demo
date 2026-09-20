import { Outlet } from "react-router";
import { Card, ErrorCard } from "~/components/card";
import { getUserName } from "~/data/users";
import type { Route } from "./+types/layout";

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
    <Card>
      <h2 className="card-title">{name}</h2>
      <Outlet />
    </Card>
  );
}

// ルート単位の ErrorBoundary。失敗してもこの位置にだけ描画され、
// 親レイアウト（サイドバー・選択状態）はそのまま生き残る
export function ErrorBoundary() {
  return <ErrorCard />;
}
