import { Link, Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { UserCard } from "~/components/user-card";
import { getUserList } from "~/data/users";
import type { Route } from "./+types/users";

// 一覧API。遷移前に取得済みなのは id と name のみ
export async function loader() {
  return { summaries: getUserList() };
}

export default function UsersLayout({ loaderData }: Route.ComponentProps) {
  const { summaries } = loaderData;
  const { active, pending } = useRouterState();

  // 詳細ルートへ userId が変わる遷移かどうかを判定する
  const pendingUserId = pending?.params.userId;
  const isUserNavigation =
    pendingUserId !== undefined && pendingUserId !== active.params.userId;

  // 先出しに使えるのは一覧で取得済みの name のみ。pending.params.userId をキーに引く
  const previewName = isUserNavigation
    ? summaries.find((s) => s.id === pendingUserId)?.name
    : undefined;

  // 選択状態は pending を優先し、遷移が確定する前にハイライトを更新する
  const selectedUserId = pendingUserId ?? active.params.userId;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">useRouterState デモ</h1>

        <div className="grid grid-cols-[200px_1fr] gap-6">
          <aside className="flex flex-col gap-2">
            {summaries.map((u) => (
              <Link
                key={u.id}
                to={`/users/${u.id}`}
                className={`btn btn-sm justify-start ${
                  u.id === selectedUserId ? "btn-primary" : "btn-ghost"
                }`}
              >
                {u.name}
              </Link>
            ))}
          </aside>

          <main>
            {previewName ? (
              // 遷移中は親が詳細レイアウトを描画する。name は一覧の値、
              // 残りは詳細データ未取得のためスケルトン
              <UserCard name={previewName} />
            ) : (
              // 遷移完了後は子ルートが loader 済みの詳細を描画する
              <Outlet />
            )}
          </main>
        </div>

        {/* デバッグ表示: active と pending の中身 */}
        <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
          <summary className="collapse-title text-sm font-medium">
            useRouterState の中身を見る
          </summary>
          <div className="collapse-content">
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(
                {
                  active: {
                    pathname: active.location.pathname,
                    params: active.params,
                  },
                  pending: pending
                    ? {
                        pathname: pending.location.pathname,
                        params: pending.params,
                        state: pending.state,
                      }
                    : null,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
