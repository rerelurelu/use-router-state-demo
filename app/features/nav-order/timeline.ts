// 2 つのモデルを並べて見せるための時間割。取得にかかる時間は
// どちらも同じにして、取得を始めるタイミングだけを変えている
export const TOTAL_MS = 1400;

export type Step = {
  // このステップが始まる時刻
  at: number;
  text: string;
  note?: string;
};

export const SPA_STEPS: Step[] = [
  { at: 0, text: "ユーザーがリンクをクリックする" },
  { at: 80, text: "Router が遷移先の Route を特定する" },
  {
    at: 160,
    text: "遷移先の Component を render する",
    note: "URL はここで切り替わる。データはまだ無い",
  },
  {
    at: 220,
    text: "Component 側で必要なデータの取得を開始する",
    note: "SWR / TanStack Query / useEffect など",
  },
  { at: 1120, text: "データ取得が完了する" },
  { at: 1180, text: "取得したデータを使って Component を再 render する" },
];

export const DATA_STEPS: Step[] = [
  { at: 0, text: "ユーザーがリンクをクリックする" },
  { at: 80, text: "Router が遷移先の Route を特定する" },
  {
    at: 160,
    text: "遷移先の Route に定義された loader を実行する",
    note: "この間、URL も画面も遷移前のまま",
  },
  { at: 1060, text: "必要なデータの取得が完了する" },
  { at: 1120, text: "画面遷移を commit する", note: "URL はここで切り替わる" },
  {
    at: 1180,
    text: "取得したデータを使って遷移先の Component を render する",
  },
];

// URL と画面が切り替わる時刻。この 2 つの差がページの主題
export const SPA_COMMIT_MS = 160;
export const DATA_COMMIT_MS = 1120;

// 進行中のステップの index を返す。未実行なら null
export function currentStep(steps: Step[], elapsed: number | null) {
  if (elapsed === null) {
    return null;
  }
  let index = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step && elapsed >= step.at) {
      index = i;
    }
  }
  return index;
}
