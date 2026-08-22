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
