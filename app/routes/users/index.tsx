import { Card } from "~/components/card";

export default function UsersIndex() {
  return (
    <Card>
      <p className="opacity-70">サイドバーからメンバーを選択してください。</p>
      <p className="text-sm opacity-50">
        詳細の loader は 1.5 秒遅延させています。選択直後、名前だけ即時に表示され、
        残りの情報は loader 完了までスケルトンで表示されます。
      </p>
      <p className="text-sm opacity-50">
        「渡辺 翔太」は通信失敗をシミュレートします。名前の先出しは走り、
        loader 失敗後はメインだけエラー表示に切り替わります（サイドバーは維持）。
      </p>
    </Card>
  );
}
