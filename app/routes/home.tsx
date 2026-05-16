export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">useRouterState デモ</h1>
        <p className="mt-2 text-sm opacity-60">
          React Router の unstable_useRouterState を題材ごとに試せます。
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/users"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">一覧 → 詳細のプレビュー表示</span>
          <span className="text-xs font-normal opacity-80">
            遷移確定前に名前・タブを先出し（pending.params / matches）
          </span>
        </a>
        <a
          href="/steps"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">ステップ遷移のアニメーション</span>
          <span className="text-xs font-normal opacity-80">
            遷移の種類でスケルトンを出し分け（pending.type）
          </span>
        </a>
      </div>
    </div>
  );
}
