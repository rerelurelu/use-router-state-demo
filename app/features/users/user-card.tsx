import { Card } from "~/components/card";
import { DefinitionList, Field } from "~/components/definition-list";
import type { User } from "~/data/users";

// 詳細レイアウト配下（見出しは親が描画）でも単体でも使う
export function UserFields({ detail }: { detail?: User }) {
  return (
    <DefinitionList pending={detail === undefined}>
      <Field label="役職" value={detail?.title} />
      <Field label="部署" value={detail?.department} />
      <Field label="メール" value={detail?.email} />
      <Field label="入社日" value={detail?.joinedAt} />
      <Field label="自己紹介" value={detail?.bio} />
    </DefinitionList>
  );
}

// 名前見出し付きの単体カード。親レイアウトが無い先出し（一覧→詳細）で使う
export function UserCard({ name, detail }: { name: string; detail?: User }) {
  return (
    <Card>
      <h2 className="card-title">{name}</h2>
      <div className="mt-2">
        <UserFields detail={detail} />
      </div>
    </Card>
  );
}
