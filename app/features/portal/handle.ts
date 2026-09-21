import { unstable_useRouterState as useRouterState } from "react-router";
import { usePendingBoundary } from "~/lib/pending-boundary";

// ポータルの各ルートが export する handle の型。
// URL 文字列からは導けない「そのルートの見た目」をルート自身に持たせる
export type RouteHandle = {
  // ヘッダに出すページタイトル
  title?: string;
  breadcrumb?: string;
  // 中身のカラムの最大幅。narrow は設定や概要、full は表向け
  contentWidth?: "narrow" | "full";
  // このルートが差し替わるときに描くスケルトンの形
  skeleton?: SkeletonKind;
};

export type SkeletonKind = "card" | "table" | "list" | "split";

export const WIDTH_CLASS: Record<
  Required<RouteHandle>["contentWidth"],
  string
> = {
  narrow: "max-w-2xl",
  full: "",
};

// matches の handle は unknown なので、narrowing してから読む
export function isRouteHandle(value: unknown): value is RouteHandle {
  return typeof value === "object" && value !== null;
}

// 行き先のモジュールが未読み込みだと handle は undefined になる。
// そのとき枠を持つ card を選ぶと、カードの内側に入れ子のカードが出るため、
// 既定値は枠を持たない list にする
const DEFAULT_SKELETON: SkeletonKind = "list";

const DEFAULT_HANDLE = {
  title: "社内ポータル",
  contentWidth: "full",
} as const satisfies Pick<RouteHandle, "title" | "contentWidth">;

// breadcrumb は usePendingBreadcrumbs 側で扱うのでここには無い
type ResolvedHandle = {
  title: string;
  contentWidth: "narrow" | "full";
};

// routeId には呼び出し元のレイアウト自身のルート ID を渡す
export function usePendingScope(routeId: string): {
  isOutletPending: boolean;
  skeleton: SkeletonKind;
} {
  const { active, pending } = useRouterState();
  const boundary = usePendingBoundary();

  const myIndex = active.matches.findIndex((m) => m.id === routeId);
  const isOutletPending = boundary !== null && boundary === myIndex + 1;

  // 差し替わるのは boundary の位置のルートなので、そこから浅い順に探す。
  // 深いほうから探すと、親のカード枠ごと差し替わる遷移で子の中身の形を
  // 拾ってしまい、枠が消えたまま中身だけが描かれる
  const skeleton =
    isOutletPending && pending && boundary !== null
      ? (pending.matches
          .slice(boundary)
          .map((m) => m.handle)
          .filter(isRouteHandle)
          .find((h) => h.skeleton)?.skeleton ?? DEFAULT_SKELETON)
      : DEFAULT_SKELETON;

  return { isOutletPending, skeleton };
}

// pending 中は行き先の handle、そうでなければ現在の handle を、
// 末尾のルートから優先してプロパティごとに解決する
export function usePendingHandle(): ResolvedHandle {
  const { active, pending } = useRouterState();
  const matches = pending?.matches ?? active.matches;

  const handles = matches.map((m) => m.handle).filter(isRouteHandle);

  return {
    title:
      handles.findLast((h) => h.title !== undefined)?.title ??
      DEFAULT_HANDLE.title,
    contentWidth:
      handles.findLast((h) => h.contentWidth !== undefined)?.contentWidth ??
      DEFAULT_HANDLE.contentWidth,
  };
}

export type Breadcrumb = { id: string; label: string; pathname: string };

// pending 中は行き先の matches からパンくずを組み立てる
export function usePendingBreadcrumbs(): Breadcrumb[] {
  const { active, pending } = useRouterState();
  const matches = pending?.matches ?? active.matches;

  // key にはルート ID を使う。index ルートの pathname は親と同じになるため、
  // pathname を key にすると /portal/projects/1 で「詳細」と「概要」が重複する
  return matches.flatMap((match) =>
    isRouteHandle(match.handle) && match.handle.breadcrumb !== undefined
      ? [
          {
            id: match.id,
            label: match.handle.breadcrumb,
            pathname: match.pathname,
          },
        ]
      : [],
  );
}
