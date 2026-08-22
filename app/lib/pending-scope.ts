import { unstable_useRouterState as useRouterState } from "react-router";

// 各ルートが export する handle の型。ヘッダの見た目とスケルトンの形を決める
export type RouteHandle = {
  // ヘッダに出すページタイトル
  title?: string;
  // パンくずに出す短いラベル
  breadcrumb?: string;
  // 中身のカラムの最大幅。narrow はフォームや設定、full は表向け
  contentWidth?: "narrow" | "full";
  skeleton?: "card" | "table" | "list";
};

// handle は型が絞られていないので、narrowing してから読む
export function isRouteHandle(value: unknown): value is RouteHandle {
  return typeof value === "object" && value !== null;
}

const DEFAULT_HANDLE: Required<RouteHandle> = {
  title: "コンソール",
  breadcrumb: "コンソール",
  contentWidth: "full",
  skeleton: "card",
};

// usePendingHandle が返す値。breadcrumb は usePendingBreadcrumbs 側で扱うのでここには含めない
type ResolvedHandle = {
  title: string;
  contentWidth: "narrow" | "full";
  skeleton: "card" | "table" | "list";
};

// 今回の遷移で差し替わる階層の先頭 index を返す。active.matches と
// pending.matches を先頭から比較し、id か pathname が食い違う位置を探す。
// id だけの比較だと同じルートで params だけ変わる遷移（例: projectId が変わる）を
// 検出できないため、matches の pathname（ルータが階層ごとに計算した値）も見る
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

// routeId のレイアウトが Outlet をスケルトンに差し替えるべきかどうかと、
// 差し替え時に描くスケルトンの形を返す
export function usePendingScope(routeId: string): {
  isOutletPending: boolean;
  skeleton: "card" | "table" | "list";
} {
  const { active, pending } = useRouterState();
  const boundary = usePendingBoundary();

  const myIndex = active.matches.findIndex((m) => m.id === routeId);
  const isOutletPending = boundary !== null && boundary === myIndex + 1;

  let skeleton: "card" | "table" | "list" = "card";
  if (isOutletPending && pending && boundary !== null) {
    for (let i = pending.matches.length - 1; i >= boundary; i--) {
      const handle = pending.matches[i]?.handle;
      if (isRouteHandle(handle) && handle.skeleton) {
        skeleton = handle.skeleton;
        break;
      }
    }
  }

  return { isOutletPending, skeleton };
}

// pending 中は行き先の handle、そうでなければ現在の handle を、
// 末尾のルートから優先してプロパティごとに解決する
export function usePendingHandle(): ResolvedHandle {
  const { active, pending } = useRouterState();
  const matches = pending?.matches ?? active.matches;

  const resolved: ResolvedHandle = {
    title: DEFAULT_HANDLE.title,
    contentWidth: DEFAULT_HANDLE.contentWidth,
    skeleton: DEFAULT_HANDLE.skeleton,
  };
  let titleFound = false;
  let contentWidthFound = false;
  let skeletonFound = false;

  for (let i = matches.length - 1; i >= 0; i--) {
    const handle = matches[i]?.handle;
    if (!isRouteHandle(handle)) {
      continue;
    }
    if (!titleFound && handle.title !== undefined) {
      resolved.title = handle.title;
      titleFound = true;
    }
    if (!contentWidthFound && handle.contentWidth !== undefined) {
      resolved.contentWidth = handle.contentWidth;
      contentWidthFound = true;
    }
    if (!skeletonFound && handle.skeleton !== undefined) {
      resolved.skeleton = handle.skeleton;
      skeletonFound = true;
    }
  }

  return resolved;
}

// pending 中は行き先の matches からパンくずを組み立てる。
// handle.breadcrumb を持つマッチだけを階層順に拾う
export function usePendingBreadcrumbs(): {
  id: string;
  label: string;
  pathname: string;
}[] {
  const { active, pending } = useRouterState();
  const matches = pending?.matches ?? active.matches;

  // key にはルート ID を使う。index ルートの pathname は親と同じになるため、
  // pathname を key にすると /console/projects/1 で「詳細」と「概要」が重複する
  const breadcrumbs: { id: string; label: string; pathname: string }[] = [];
  for (const match of matches) {
    const handle = match.handle;
    if (isRouteHandle(handle) && handle.breadcrumb !== undefined) {
      breadcrumbs.push({
        id: match.id,
        label: handle.breadcrumb,
        pathname: match.pathname,
      });
    }
  }
  return breadcrumbs;
}
