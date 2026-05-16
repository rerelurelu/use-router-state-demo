import { UserCard } from "~/components/user-card";
import { getUserSlow } from "~/data/users";
import type { Route } from "./+types/users.detail";

export async function loader({ params }: Route.LoaderArgs) {
  const user = await getUserSlow(params.userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return { user };
}

export default function UserDetail({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return <UserCard name={user.name} detail={user} />;
}

// ルート単位の ErrorBoundary。失敗してもこの位置にだけ描画され、
// 親レイアウト（サイドバー・選択状態）はそのまま生き残る。
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
