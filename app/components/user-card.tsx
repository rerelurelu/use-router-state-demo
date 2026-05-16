import type { User } from "~/data/users";

type Props = {
  name: string;
  // 詳細データ。loader 完了後のみ渡され、未確定時は undefined。
  detail?: User;
};

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

export function UserCard({ name, detail }: Props) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>

        {/* detail 未確定の項目はスケルトン表示 */}
        <dl className="mt-2 divide-y divide-base-200">
          <Field label="役職" value={detail?.title} />
          <Field label="部署" value={detail?.department} />
          <Field label="メール" value={detail?.email} />
          <Field label="入社日" value={detail?.joinedAt} />
          <Field label="自己紹介" value={detail?.bio} />
        </dl>
      </div>
    </div>
  );
}
