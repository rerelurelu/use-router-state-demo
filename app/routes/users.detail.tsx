import { Link, Outlet } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { UserFields } from "~/components/user-card";
import { getUserName } from "~/data/users";
import type { Route } from "./+types/users.detail";

const ACTIVITY_ROUTE_ID = "routes/users.detail.activity";

// 見出し用に名前だけを即時取得する。重い取得・失敗は各タブの loader 側
export async function loader({ params }: Route.LoaderArgs) {
  const name = getUserName(params.userId);
  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }
  return { name };
}

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton h-5 w-full rounded" />
      ))}
    </div>
  );
}

export default function UserDetailLayout({
  loaderData,
}: Route.ComponentProps) {
  const { name } = loaderData;
  const { active, pending } = useRouterState();

  // タブ判定は pending.matches を優先する。両タブとも params は
  // { userId } で同一なので、行き先はルートIDでしか区別できない
  const matches = pending?.matches ?? active.matches;
  const leafId = matches[matches.length - 1]?.id;
  const targetTab = leafId === ACTIVITY_ROUTE_ID ? "activity" : "profile";

  // 同一ユーザー内のタブ切り替えが進行中か
  const isTabPending =
    pending != null && pending.params.userId === active.params.userId;

  const userId = pending?.params.userId ?? active.params.userId;

  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>

        <div role="tablist" className="tabs tabs-border mb-2">
          <Link
            role="tab"
            to={`/users/${userId}`}
            className={`tab ${targetTab === "profile" ? "tab-active" : ""}`}
          >
            プロフィール
          </Link>
          <Link
            role="tab"
            to={`/users/${userId}/activity`}
            className={`tab ${targetTab === "activity" ? "tab-active" : ""}`}
          >
            活動履歴
          </Link>
        </div>

        {isTabPending ? (
          // タブ切り替え中は、行き先タブ（pending.matches 由来）に合わせた
          // スケルトンを出す。タブのハイライトは既に切り替わっている
          targetTab === "activity" ? (
            <ActivitySkeleton />
          ) : (
            <UserFields />
          )
        ) : (
          <Outlet />
        )}
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
