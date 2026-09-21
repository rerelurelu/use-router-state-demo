import { unstable_useRouterState as useRouterState } from "react-router";

// 今回の遷移で差し替わる階層の先頭 index を返す。active.matches と
// pending.matches を先頭から比較し、id か pathname が食い違う位置を探す。
// id だけの比較だと同じルートで params だけ変わる遷移（例: projectId が変わる）を
// 検出できないため、matches の pathname（ルータが階層ごとに計算した値）も見る。
// 遷移していないときは null を返す。
//
// useRouterState 以外に依存しないので、handle の設計とは独立して使える
export function usePendingBoundary(): number | null {
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

  // 全マッチが一致する遷移（同じ URL をもう一度開く）でも loader は再実行される。
  // このとき最深のマッチを差し替え対象にしないと、待っている間に何も表示が変わらない。
  // 長さが違う場合は片方が他方の先頭部分なので、境界は短いほうの長さのまま。
  if (active.matches.length === pending.matches.length) {
    return Math.max(0, length - 1);
  }
  return length;
}
