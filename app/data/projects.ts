export type Project = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updatedAt: string;
  summary: string;
};

export type Task = {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
};

// サーバ側のデータ。モジュール外には公開しない
const projects: Project[] = [
  {
    id: "1",
    name: "サイト刷新",
    owner: "佐藤 健太",
    status: "進行中",
    updatedAt: "2026-08-18",
    summary: "コーポレートサイトのデザインと基盤刷新プロジェクト。",
  },
  {
    id: "2",
    name: "モバイルアプリ",
    owner: "鈴木 美咲",
    status: "計画中",
    updatedAt: "2026-08-10",
    summary: "iOS / Android 向けの新規アプリ開発プロジェクト。",
  },
  {
    id: "3",
    name: "社内基盤移行",
    owner: "高橋 大輔",
    status: "進行中",
    updatedAt: "2026-08-20",
    summary: "社内システムをクラウド基盤へ移行するプロジェクト。",
  },
];

const tasks: Record<string, Task[]> = {
  "1": [
    { id: "t1", title: "トップページのワイヤーフレーム", assignee: "佐藤 健太", done: true },
    { id: "t2", title: "デザインシステムの選定", assignee: "鈴木 美咲", done: true },
    { id: "t3", title: "実装ガイドラインの作成", assignee: "高橋 大輔", done: false },
    { id: "t4", title: "アクセシビリティ監査", assignee: "田中 由美", done: false },
  ],
  "2": [
    { id: "t1", title: "要件定義", assignee: "鈴木 美咲", done: true },
    { id: "t2", title: "画面設計", assignee: "渡辺 翔太", done: false },
    { id: "t3", title: "技術選定", assignee: "高橋 大輔", done: false },
  ],
  "3": [
    { id: "t1", title: "移行対象システムの棚卸し", assignee: "高橋 大輔", done: true },
    { id: "t2", title: "移行計画書の作成", assignee: "佐藤 健太", done: true },
    { id: "t3", title: "テスト環境の構築", assignee: "渡辺 翔太", done: false },
    { id: "t4", title: "本番切り替え", assignee: "高橋 大輔", done: false },
  ],
};

// 一覧API。遅延なし
export function getProjectList(): Pick<Project, "id" | "name">[] {
  return projects.map(({ id, name }) => ({ id, name }));
}

// 名前だけを即時に返す。詳細レイアウトの見出し用
export function getProjectName(id: string | undefined): string | undefined {
  return projects.find((p) => p.id === id)?.name;
}

// 概要API。遅延は pending 状態を観察するための擬似的なもの
export async function getProjectOverview(
  id: string | undefined,
): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const project = projects.find((p) => p.id === id);
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }
  return project;
}

// タスク一覧API。遅延は pending 状態を観察するための擬似的なもの
export async function getProjectTasks(
  id: string | undefined,
): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return id ? (tasks[id] ?? []) : [];
}

const reportRows = [
  { id: "r1", label: "総プロジェクト数", value: "3" },
  { id: "r2", label: "進行中", value: "2" },
  { id: "r3", label: "完了タスク", value: "5" },
  { id: "r4", label: "未完了タスク", value: "6" },
  { id: "r5", label: "今月の更新回数", value: "12" },
];

// レポートAPI。遅延は pending 状態を観察するための擬似的なもの
export async function getReportRows() {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return reportRows;
}

const settings = [
  { id: "s1", label: "通知", value: "有効" },
  { id: "s2", label: "テーマ", value: "ライト" },
  { id: "s3", label: "言語", value: "日本語" },
  { id: "s4", label: "タイムゾーン", value: "Asia/Tokyo" },
];

// 設定API。遅延は pending 状態を観察するための擬似的なもの
export async function getSettings() {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return settings;
}
