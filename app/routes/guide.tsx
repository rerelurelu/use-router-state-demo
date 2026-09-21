import { Link } from "react-router";
import { Card } from "~/components/card";
import { PageShell } from "~/components/page-shell";
import {
  BOUNDARY_CASES,
  DEMOS,
  RETURN_VALUE,
} from "~/features/guide/content";

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded bg-base-300 p-4 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card as="section" id={id} bodyClassName="gap-4">
      <h2 className="card-title text-lg">{title}</h2>
      {children}
    </Card>
  );
}

export default function Guide() {
  return (
    <PageShell
      maxWidth="max-w-3xl"
      title="useRouterState の解説とこのデモの構成"
      description="React Router v8 の unstable_useRouterState が何を返すのか、このリポジトリでどう使っているのかをまとめています。"
    >

        <Section id="return-value" title="1. 何が返るのか">
          <p className="text-sm leading-relaxed">
            返り値は <code className="text-primary">{"{ active, pending }"}</code>{" "}
            の 2 つです。<code className="text-primary">active</code>{" "}
            は表示中のルート、<code className="text-primary">pending</code>{" "}
            は遷移中のルートを指します。遷移していない間、
            <code className="text-primary">pending</code> は{" "}
            <code className="text-primary">null</code> です。
          </p>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>中身</th>
                  <th>このフックが出る前</th>
                </tr>
              </thead>
              <tbody>
                {RETURN_VALUE.map((row) => (
                  <tr key={row.field} className={row.isNew ? "bg-warning/10" : ""}>
                    <td className="font-mono text-xs whitespace-nowrap">
                      {row.field}
                    </td>
                    <td className="text-xs">{row.desc}</td>
                    <td className="text-xs opacity-70">{row.before}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed">
            色の付いた 3 行が、このフックで初めて取れるようになった値です。
            それ以外は既存フックの寄せ集めで、書き方が短くなるだけです。
          </p>
          <p className="text-sm leading-relaxed">
            <code className="text-primary">matches</code> の要素は{" "}
            <code className="text-primary">
              {"{ id, pathname, params, handle }"}
            </code>{" "}
            で、<code className="text-primary">data</code> や{" "}
            <code className="text-primary">loaderData</code> は含まれません。
            ローダーのデータが変わっただけでは再レンダリングが起きないようにするためです。
          </p>
        </Section>

        <Section id="demos" title="2. デモの構成">
          <div className="flex flex-col gap-3">
            {DEMOS.map((demo) => (
              <Link
                key={demo.to}
                to={demo.to}
                className="rounded border border-base-300 p-4 hover:bg-base-200"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-bold text-primary">
                    {demo.title}
                  </span>
                  <span className="font-mono text-xs opacity-50">
                    {demo.file}
                  </span>
                </div>
                <p className="mt-1 text-sm opacity-80">{demo.desc}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section id="params" title="3. pending.params — 遷移先のレコードを先に知る">
          <p className="text-sm leading-relaxed">
            一覧の loader で名前は取得済みなので、詳細の loader が終わる前に見出しを確定できます。
            遷移先の id は <code className="text-primary">pending.params</code>{" "}
            から取ります。
          </p>
          <Code>{`const { active, pending } = useRouterState();

// 詳細ルートへ userId が変わる遷移かどうかを判定する
const pendingUserId = pending?.params.userId;
const isUserNavigation =
  pendingUserId !== undefined && pendingUserId !== active.params.userId;

// 先出しに使えるのは一覧で取得済みの name のみ
const previewName = isUserNavigation
  ? summaries.find((s) => s.id === pendingUserId)?.name
  : undefined;

// 選択状態は pending を優先し、遷移が確定する前にハイライトを更新する
const selectedUserId = pendingUserId ?? active.params.userId;`}</Code>
          <p className="text-sm leading-relaxed">
            サイドバーのハイライトも同じ値で決めているため、クリックから選択が移るまでの待ち時間がありません。
          </p>
        </Section>

        <Section id="type" title="4. pending.type — 遷移の向きで見せ方を変える">
          <p className="text-sm leading-relaxed">
            <code className="text-primary">useNavigationType</code>{" "}
            が返すのは遷移が完了したあとの値なので、遷移中に PUSH か POP
            かを知る手段はこれまでありませんでした。
          </p>
          <Code>{`// 遷移中に一覧をどう見せるかを pending.type だけで決める
switch (pending.type) {
  case "PUSH":    // ページ送り。中身が入れ替わるのでスケルトン
    return <ProductListSkeleton />;
  case "REPLACE": // 絞り込み。見ていた一覧は残して薄くする
    return <div className="opacity-40"><ProductList /></div>;
  case "POP":     // 戻る・進む。中身には触れず進行中だけ伝える
    return <><ProgressBar /><ProductList /></>;
}`}</Code>
          <p className="text-sm leading-relaxed">
            絞り込みとページ送りはどちらも{" "}
            <code className="text-primary">/products</code>{" "}
            のままクエリだけが変わるので、URL の形からは区別できません。
            履歴を積むかどうかは{" "}
            <code className="text-primary">setSearchParams</code>{" "}
            の呼び出し側で決めていて、その判断がそのまま{" "}
            <code className="text-primary">pending.type</code> に出ます。
          </p>
          <p className="text-sm leading-relaxed">
            <code className="text-primary">pending.type</code>{" "}
            が必要なのは REPLACE を除外する部分です。「最初からやり直す」は{" "}
            <code className="text-primary">replace</code>{" "}
            なので、前後の移動として扱うとスライドの向きが意味を持ちません。遷移中に PUSH / POP /
            REPLACE を知る手段は{" "}
            <code className="text-primary">pending.type</code>{" "}
            以外にありません。
          </p>
        </Section>

        <Section
          id="matches"
          title="5. pending.matches — 差し替わる階層を求める"
        >
          <p className="text-sm leading-relaxed">
            <code className="text-primary">active.matches</code> と{" "}
            <code className="text-primary">pending.matches</code>{" "}
            を先頭から比較すると、今回の遷移で差し替わるのがどの階層からかが分かります。
            その位置より浅い階層はスケルトンにせず、操作できる状態のまま残せます。
          </p>
          <Code>{`export function usePendingBoundary(): number | null {
  const { active, pending } = useRouterState();
  if (!pending) {
    return null;
  }

  const length = Math.min(active.matches.length, pending.matches.length);
  for (let i = 0; i < length; i++) {
    const a = active.matches[i];
    const p = pending.matches[i];
    if (a?.id !== p?.id || a?.pathname !== p?.pathname) {
      return i;
    }
  }
  return length;
}`}</Code>
          <p className="text-sm leading-relaxed">
            返した index から下が差し替わるので、
            <code className="text-primary">index - 1</code>{" "}
            のレイアウトが「生き残る最も深いレイアウト」になります。そのレイアウトが自分の{" "}
            <code className="text-primary">Outlet</code>{" "}
            をスケルトンに差し替えます。
          </p>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>遷移</th>
                  <th>差分 index</th>
                  <th>覆う範囲</th>
                  <th>差し替えるレイアウト</th>
                </tr>
              </thead>
              <tbody>
                {BOUNDARY_CASES.map((row) => (
                  <tr key={row.move}>
                    <td className="text-xs whitespace-nowrap">{row.move}</td>
                    <td className="text-xs">{row.boundary}</td>
                    <td className="text-xs">{row.scope}</td>
                    <td className="font-mono text-xs">{row.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="pitfall" title="6. ハマりどころ: ルート ID だけでは足りない">
          <p className="text-sm leading-relaxed">
            最初の実装では比較を{" "}
            <code className="text-primary">id</code>{" "}
            だけで行っていて、「プロジェクト 1 → 2」の遷移でスケルトンが出ませんでした。
            この 2 つの URL はマッチするルートが完全に同じで、違うのは params だけだからです。
          </p>
          <Code>{`/portal/projects/1  → [root, portal, projects, projects.detail, overview]
/portal/projects/2  → [root, portal, projects, projects.detail, overview]
                        ルート ID の配列は完全に一致する`}</Code>
          <p className="text-sm leading-relaxed">
            マッチオブジェクトの{" "}
            <code className="text-primary">pathname</code>{" "}
            はルータが階層ごとに計算した値なので、詳細レイアウトの位置で{" "}
            <code className="text-primary">/portal/projects/1</code> と{" "}
            <code className="text-primary">/portal/projects/2</code>{" "}
            に分かれます。判定に <code className="text-primary">pathname</code>{" "}
            も加えることで params の変化を拾えます。
          </p>
          <p className="text-sm leading-relaxed opacity-70">
            公式ドキュメントにも RFC にも書かれていない挙動です。
          </p>
        </Section>

        <Section id="handle" title="7. handle — URL からは導けない情報">
          <p className="text-sm leading-relaxed">
            <code className="text-primary">matches</code> の要素には、各ルートモジュールが
            export した <code className="text-primary">handle</code>{" "}
            が入っています。URL 文字列からは導けないので、
            <code className="text-primary">matches</code>{" "}
            を使う必然性がここにあります。
          </p>
          <Code>{`// app/routes/portal/settings.tsx
export const handle = {
  title: "設定",
  breadcrumb: "設定",
  contentWidth: "narrow",
  skeleton: "list",
} satisfies RouteHandle;`}</Code>
          <p className="text-sm leading-relaxed">
            最上位のレイアウトが{" "}
            <code className="text-primary">
              {"pending?.matches ?? active.matches"}
            </code>{" "}
            を末尾から走査して値を解決します。pending 中は行き先の値になるので、
            ヘッダのパンくずとタイトル、中身のカラム幅がクリック直後に切り替わります。
          </p>
          <p className="text-sm leading-relaxed">
            ただし <code className="text-primary">handle</code>{" "}
            はルートモジュールの export なので、行き先のモジュールが読み込まれていない間は{" "}
            <code className="text-primary">matches</code> の要素の{" "}
            <code className="text-primary">handle</code> が{" "}
            <code className="text-primary">undefined</code>{" "}
            になります。ページを開いた直後の 1 回目の遷移がこれに当たり、
            パンくずとタイトルは遷移前のまま、スケルトンも既定の形になります。
            このデモの <code className="text-primary">Link</code> には{" "}
            <code className="text-primary">prefetch="intent"</code>{" "}
            を付けてあり、ホバーとフォーカスの時点で行き先のモジュールと loader
            のデータを先読みするため、クリックした時には{" "}
            <code className="text-primary">handle</code> が読める状態になっています。
          </p>
          <Code>{`export function usePendingBreadcrumbs(): { label: string; pathname: string }[] {
  const { active, pending } = useRouterState();
  const matches = pending?.matches ?? active.matches;

  const breadcrumbs: { label: string; pathname: string }[] = [];
  for (const match of matches) {
    const handle = match.handle;
    if (isRouteHandle(handle) && handle.breadcrumb !== undefined) {
      breadcrumbs.push({ label: handle.breadcrumb, pathname: match.pathname });
    }
  }
  return breadcrumbs;
}`}</Code>
          <p className="text-sm leading-relaxed">
            サイドバーとヘッダの位置は遷移で動かしません。動くのは中身のカラムの右端だけです。
            外枠が左右に動く UI は実際のダッシュボードには無いためです。
          </p>
        </Section>

        <Section id="limits" title="8. 使うときの制約">
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
            <li>
              <code className="text-primary">pending</code>{" "}
              は初回表示（SSR 後のハイドレーション）では{" "}
              <code className="text-primary">null</code>{" "}
              です。ここで挙げた分岐はすべて 2 回目以降の遷移でのみ働きます。初回のローディング表示には{" "}
              <code className="text-primary">HydrateFallback</code>{" "}
              など別の仕組みが必要です。
            </li>
            <li>
              <code className="text-primary">useFetcher</code>{" "}
              による送信はナビゲーションではないので{" "}
              <code className="text-primary">pending</code>{" "}
              に現れません。<code className="text-primary">useFetchers</code>{" "}
              を別に使います。
            </li>
            <li>
              selector（部分購読）はありません。このフックを呼んだコンポーネントは{" "}
              <code className="text-primary">active</code> か{" "}
              <code className="text-primary">pending</code>{" "}
              のどちらかが変わるたびに再レンダリングされます。呼ぶ階層は必要な場所に限定します。
            </li>
            <li>
              v8.3.0 時点でも export 名は{" "}
              <code className="text-primary">unstable_useRouterState</code>{" "}
              のままです。マイナー・パッチリリースで破壊的変更が入る可能性があると公式ドキュメントに明記されています。
            </li>
          </ul>
        </Section>

        <Section id="links" title="9. 参照">
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm">
            <li>
              <a
                className="link"
                href="https://reactrouter.com/api/hooks/useRouterState"
                target="_blank"
                rel="noreferrer"
              >
                useRouterState — React Router ドキュメント
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://github.com/remix-run/react-router/issues/13073"
                target="_blank"
                rel="noreferrer"
              >
                Consolidate Router State Access — 提案 issue
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://github.com/remix-run/react-router/pull/15017"
                target="_blank"
                rel="noreferrer"
              >
                Add unstable_useRouterState hook — 実装 PR
              </a>
            </li>
          </ul>
      </Section>
    </PageShell>
  );
}
