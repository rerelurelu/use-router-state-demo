# AGENTS.md

このリポジトリで作業するコーディングエージェント向けの案内。

## プロジェクトの目的

React Router v8 の `unstable_useRouterState` が何を返し、何が作れるようになるのかを確かめるデモ。題材ごとに 3 本のデモと、1 本の解説ページで構成する。

| URL       | 使う値            | 何を見せるか                                                 |
| --------- | ----------------- | ------------------------------------------------------------ |
| `/users`  | `pending.params`  | 一覧で取得済みの名前を、詳細の loader を待たずに見出しへ出す |
| `/steps`  | `pending.type`    | PUSH / POP / REPLACE でスライドの向きを変える                |
| `/portal` | `pending.matches` | 差し替わる階層だけをスケルトンにする                         |
| `/guide`  | —                 | 返り値の一覧と、上の 3 本の実装の解説                        |

`useRouterState` は `unstable_` 接頭辞付きの実験的 API。import は `unstable_useRouterState as useRouterState` の形で統一する。

## パッケージマネージャ

Bun を使う（`bun.lock` があり、`package-lock.json` は無い）。README と Dockerfile は npm 記載のままなので、ローカル作業では Bun コマンドを優先する。

## コマンド

- `bun run dev` — 開発サーバ（HMR、http://localhost:5173）
- `bun run build` — 本番ビルド（`build/client`、`build/server` を出力）
- `bun run start` — ビルド成果物を `react-router-serve` で配信
- `bun run typecheck` — `react-router typegen` で型生成 → `tsc` で型検査

テスト・Lint・フォーマッタは未設定。変更後に実行するのは `bun run typecheck` と `bun run build` の 2 つ。

## ディレクトリ構成

```
app/
  routes.ts              ルート定義。ファイル名の規約ではなくここでパスを指定する
  root.tsx               <html lang="ja" data-theme="light">、Layout、ErrorBoundary
  routes/                ルートモジュール。URL の階層とディレクトリを一致させる
    home.tsx  guide.tsx
    users/    layout.tsx  index.tsx  detail/{layout,profile}.tsx
    steps/    layout.tsx  index.tsx  step.tsx
    portal/   layout.tsx  index.tsx  reports.tsx  settings.tsx
              projects/   layout.tsx  index.tsx
                          detail/  layout.tsx  overview.tsx  tasks.tsx
  components/            デモをまたいで使う部品
  features/<name>/       1 つのデモの中だけで使う部品とロジック
  lib/                   React Router の API だけに依存する関数と定数
  data/                  擬似的なサーバ側データと取得関数
```

命名は「レイアウトを持つ階層は `layout.tsx`、index ルートは `index.tsx`、それ以外はセグメント名」に揃える。

`components/` と `features/` の線引きは呼び出し元の数で決める。2 つ以上のデモから使うなら `components/`、1 つのデモの中だけなら `features/<name>/`。`features/` どうしを import しない。
