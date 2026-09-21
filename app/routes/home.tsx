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
          href="/data-mode"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">Data Mode の画面遷移</span>
          <span className="text-xs font-normal opacity-80">
            loader が終わるまで画面が動かない、素の挙動
          </span>
        </a>
        <a
          href="/users"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">一覧 → 詳細のプレビュー表示</span>
          <span className="text-xs font-normal opacity-80">
            遷移確定前に名前を先出し（pending.params）
          </span>
        </a>
        <a
          href="/products"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">履歴操作ごとの待ち方</span>
          <span className="text-xs font-normal opacity-80">
            絞り込み・ページ送り・戻るで表示を出し分け（pending.type）
          </span>
        </a>
        <a
          href="/portal"
          className="btn btn-primary h-auto flex-col items-start gap-1 py-3 text-left"
        >
          <span className="text-base">差し替わる範囲を絞ったローディング</span>
          <span className="text-xs font-normal opacity-80">
            matches の差分で範囲を決め、handle で見た目を決める（pending.matches）
          </span>
        </a>
      </div>

      <a href="/guide" className="link link-hover text-sm opacity-60">
        useRouterState の解説とこのデモの構成を読む →
      </a>
    </div>
  );
}
