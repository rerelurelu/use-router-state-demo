// ガイドページに並べる表とリンクの内容。文章量が多いので本文から分ける
export const RETURN_VALUE = [
  {
    field: "active.location",
    desc: "表示中の URL",
    before: "useLocation()",
    isNew: false,
  },
  {
    field: "active.searchParams",
    desc: "表示中のクエリ文字列",
    before: "useSearchParams()[0]",
    isNew: false,
  },
  {
    field: "active.params",
    desc: "表示中の URL パラメータ",
    before: "useParams()",
    isNew: false,
  },
  {
    field: "active.matches",
    desc: "表示中のルートの配列",
    before: "useMatches()",
    isNew: false,
  },
  {
    field: "active.type",
    desc: "直前の遷移の種類",
    before: "useNavigationType()",
    isNew: false,
  },
  {
    field: "pending.location",
    desc: "遷移先の URL",
    before: "useNavigation().location",
    isNew: false,
  },
  {
    field: "pending.state",
    desc: "loading / submitting（idle 時は pending 自体が null）",
    before: "useNavigation().state",
    isNew: false,
  },
  {
    field: "pending.params",
    desc: "遷移先の URL パラメータ",
    before: "取得手段が無かった",
    isNew: true,
  },
  {
    field: "pending.matches",
    desc: "遷移先にマッチするルートの配列",
    before: "取得手段が無かった",
    isNew: true,
  },
  {
    field: "pending.type",
    desc: "その遷移が PUSH / POP / REPLACE のどれか",
    before: "取得手段が無かった",
    isNew: true,
  },
];

export const DEMOS = [
  {
    to: "/users",
    title: "pending.params",
    file: "app/routes/users/layout.tsx",
    desc: "一覧で取得済みの名前を、詳細の loader を待たずに見出しへ先出しする。",
  },
  {
    to: "/steps",
    title: "pending.type",
    file: "app/routes/steps/layout.tsx",
    desc: "ステップ番号が増える遷移は右から、減る遷移は左からスライド。REPLACE はフェードのみ。",
  },
  {
    to: "/portal",
    title: "pending.matches",
    file: "app/features/portal/handle.ts",
    desc: "差し替わる階層だけをスケルトンにして、handle でヘッダとカラム幅を先に切り替える。",
  },
];

export const BOUNDARY_CASES = [
  {
    move: "概要 → タスク",
    boundary: "4",
    scope: "サブナビの中身だけ",
    owner: "portal/projects/detail/layout",
  },
  {
    move: "プロジェクト 1 → 2",
    boundary: "3",
    scope: "見出しごと右カラム",
    owner: "portal/projects/layout",
  },
  {
    move: "プロジェクト → レポート",
    boundary: "2",
    scope: "サイドバー以外の全体",
    owner: "portal/layout",
  },
];
