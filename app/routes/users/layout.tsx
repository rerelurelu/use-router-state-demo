import { Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { NavButton } from "~/components/nav-button";
import { PageShell } from "~/components/page-shell";
import { StateInspector } from "~/components/state-inspector";
import { getUserList } from "~/data/users";
import { UserCard } from "~/features/users/user-card";
import type { Route } from "./+types/layout";

// 一覧API。遷移前に取得済みなのは id と name のみ
export async function loader() {
  return { summaries: getUserList() };
}

export default function UsersLayout({ loaderData }: Route.ComponentProps) {
  const { summaries } = loaderData;
  const { active, pending } = useRouterState();

  const pendingUserId = pending?.params.userId;
  const isUserNavigation =
    pendingUserId !== undefined && pendingUserId !== active.params.userId;

  // 先出しに使えるのは一覧で取得済みの name のみ
  const previewName = isUserNavigation
    ? summaries.find((s) => s.id === pendingUserId)?.name
    : undefined;

  // 選択状態は pending を優先し、遷移が確定する前にハイライトを更新する
  const selectedUserId = pendingUserId ?? active.params.userId;

  return (
    <PageShell maxWidth="max-w-4xl" title="useRouterState デモ">
      <div className="grid grid-cols-[200px_1fr] gap-6">
        <aside className="flex flex-col gap-2">
          {summaries.map((u) => (
            <NavButton
              key={u.id}
              to={`/users/${u.id}`}
              selected={u.id === selectedUserId}
            >
              {u.name}
            </NavButton>
          ))}
        </aside>

        <div className="min-w-0">
          {previewName ? (
            // 遷移中は親が詳細レイアウトを描画する。name は一覧の値、
            // 残りは詳細データ未取得のためスケルトン
            <UserCard name={previewName} />
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      <StateInspector
        data={{
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
        }}
      />
    </PageShell>
  );
}
