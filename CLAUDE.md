# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクトの目的

React Router v7 (framework mode) の `useRouterState` を検証するためのデモプロジェクト。`app/root.tsx` の `<title>` も "useRouterState Demo"。検証コードは未実装で、現状は雛形に近い状態。

## パッケージマネージャ

Bun を使用する（`bun.lock` が存在し、`package-lock.json` は無い）。README と Dockerfile は npm 記載のままだが、ローカル作業では Bun コマンドを優先すること。

## コマンド

- `bun run dev` — 開発サーバ（HMR、http://localhost:5173）
- `bun run build` — 本番ビルド（`build/client`, `build/server` を出力）
- `bun run start` — ビルド成果物を `react-router-serve` で配信
- `bun run typecheck` — `react-router typegen` で型生成 → `tsc` で型検査

テスト・Lint・フォーマッタは未設定（CLI も依存も無い）。

## アーキテクチャ

React Router v7 の framework mode（SSR、`react-router.config.ts` の `ssr: true`）。Remix 系の規約を踏襲する。

- ルート定義は `app/routes.ts` に集約。`index()` / `route()` ヘルパで登録し、現状は `routes/home.tsx` を index ルートとして登録しているのみ。
- 各ルートモジュールは `loader` / `action` / `meta` / `default` (component) を named/default export する規約。
- `app/root.tsx` が全体レイアウト（`<html lang="ja" data-theme="light">`、`Layout`、`ErrorBoundary`）を担う。
- 型は自動生成。各ルートは `./+types/<name>` から `Route` 型を import する（`react-router typegen` が `.react-router/types/` に生成。手書き編集禁止、ルート追加・変更時は typegen を再実行）。
- パスエイリアス: `~/*` → `app/*`（`tsconfig.json`）。

## スタイリング

Tailwind CSS v4 + daisyUI。`app/app.css` で `@import "tailwindcss"` と `@plugin "daisyui"` を宣言（Tailwind config ファイルは無く CSS-first 構成）。Vite プラグイン経由（`@tailwindcss/vite`）。テーマは `root.tsx` の `data-theme="light"` で light 固定。
