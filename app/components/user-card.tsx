import type { User } from "~/data/users";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
      <dt className="text-sm opacity-60">{label}</dt>
      {value === undefined ? (
        <dd className="skeleton h-4 w-48 rounded" />
      ) : (
        <dd className="text-sm">{value}</dd>
      )}
    </div>
  );
}

// 詳細項目の一覧。detail 未確定の項目はスケルトン表示
// 詳細レイアウト配下（見出しは親が描画）でも単体でも使う
export function UserFields({ detail }: { detail?: User }) {
  return (
    <dl className="divide-y divide-base-200">
      <Field label="役職" value={detail?.title} />
      <Field label="部署" value={detail?.department} />
      <Field label="メール" value={detail?.email} />
      <Field label="入社日" value={detail?.joinedAt} />
      <Field label="自己紹介" value={detail?.bio} />
    </dl>
  );
}

// 名前見出し付きの単体カード。親レイアウトが無い先出し（一覧→詳細）で使う
export function UserCard({ name, detail }: { name: string; detail?: User }) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="mt-2">
          <UserFields detail={detail} />
        </div>
      </div>
    </div>
  );
}
