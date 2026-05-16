// 詳細APIのレスポンス（全フィールド）
export type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  joinedAt: string;
  bio: string;
};

// 一覧APIのレスポンス（id と name のみ）
export type UserSummary = Pick<User, "id" | "name">;

// サーバ側のデータ。モジュール外には公開しない
const users: User[] = [
  {
    id: "1",
    name: "佐藤 健太",
    email: "sato.kenta@example.com",
    department: "プロダクト開発部",
    title: "シニアエンジニア",
    joinedAt: "2019-04-01",
    bio: "フロントエンド基盤を担当。設計レビューと若手のメンタリングが多め。",
  },
  {
    id: "2",
    name: "鈴木 美咲",
    email: "suzuki.misaki@example.com",
    department: "デザイン部",
    title: "UXデザイナー",
    joinedAt: "2021-10-01",
    bio: "ユーザーリサーチからプロトタイピングまで一貫して担当。",
  },
  {
    id: "3",
    name: "高橋 大輔",
    email: "takahashi.daisuke@example.com",
    department: "プロダクト開発部",
    title: "テックリード",
    joinedAt: "2017-07-01",
    bio: "バックエンドアーキテクチャと採用面接を担当。",
  },
  {
    id: "4",
    name: "田中 由美",
    email: "tanaka.yumi@example.com",
    department: "カスタマーサクセス部",
    title: "マネージャー",
    joinedAt: "2020-01-06",
    bio: "オンボーディング改善とチームの目標管理を推進。",
  },
  {
    id: "5",
    name: "渡辺 翔太",
    email: "watanabe.shota@example.com",
    department: "データ分析部",
    title: "データアナリスト",
    joinedAt: "2022-04-01",
    bio: "プロダクト指標のダッシュボード構築とA/Bテスト設計を担当。",
  },
];

function getUser(id: string | undefined): User | undefined {
  return users.find((u) => u.id === id);
}

// 一覧API。id と name のみ返す
export function getUserList(): UserSummary[] {
  return users.map(({ id, name }) => ({ id, name }));
}

// 名前だけを即時に返す。詳細レイアウトの見出し用
export function getUserName(id: string | undefined): string | undefined {
  return users.find((u) => u.id === id)?.name;
}

// 活動履歴の1件
export type ActivityEntry = {
  id: string;
  date: string;
  action: string;
};

const activities: Record<string, ActivityEntry[]> = {
  "1": [
    { id: "a1", date: "2026-05-15", action: "設計レビューを承認" },
    { id: "a2", date: "2026-05-12", action: "PR #482 をマージ" },
    { id: "a3", date: "2026-05-08", action: "若手の1on1を実施" },
  ],
  "2": [
    { id: "a1", date: "2026-05-16", action: "ユーザーインタビューを3件実施" },
    { id: "a2", date: "2026-05-10", action: "プロトタイプ v3 を共有" },
  ],
  "3": [
    { id: "a1", date: "2026-05-14", action: "アーキテクチャ提案書を更新" },
    { id: "a2", date: "2026-05-09", action: "採用面接を2件担当" },
  ],
  "4": [
    { id: "a1", date: "2026-05-13", action: "オンボーディング改善案をレビュー" },
    { id: "a2", date: "2026-05-07", action: "四半期目標を更新" },
  ],
  "5": [{ id: "a1", date: "2026-05-11", action: "ダッシュボードを公開" }],
};

// 活動履歴API。タブ切り替え時に pending を観察するため遅延させている
export async function getUserActivity(
  id: string | undefined,
): Promise<ActivityEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return id ? (activities[id] ?? []) : [];
}

// このIDの詳細取得は失敗させる（失敗時の挙動を確認するため）
const FAILING_IDS = new Set(["5"]);

// 詳細API。全フィールドを返す。遅延は pending を観察するための擬似的なもの
export async function getUserSlow(
  id: string | undefined,
): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (id !== undefined && FAILING_IDS.has(id)) {
    throw new Response("ユーザー情報の取得に失敗しました", { status: 500 });
  }
  return getUser(id);
}
