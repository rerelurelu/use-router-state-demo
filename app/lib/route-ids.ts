// ルート ID は routes.ts に書いたファイルパスから React Router が生成する。
// 文字列を各ルートに直接書くとファイル名を変えたときに壊れるので、ここへ集める
export const ROUTE_IDS = {
  portal: "routes/portal/layout",
  projects: "routes/portal/projects/layout",
  projectDetail: "routes/portal/projects/detail/layout",
  projectTasks: "routes/portal/projects/detail/tasks",
  reports: "routes/portal/reports",
  settings: "routes/portal/settings",
} as const;
