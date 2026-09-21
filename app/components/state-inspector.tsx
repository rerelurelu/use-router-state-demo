import { unstable_useRouterState as useRouterState } from "react-router";

// useRouterState が返すプロパティのうち、そのデモで見せたいものを選ぶ
export type StateField =
  | "location"
  | "searchParams"
  | "params"
  | "matches"
  | "type"
  | "state";

function pick(state: Record<string, unknown>, fields: StateField[]) {
  const picked: Record<string, unknown> = {};
  for (const field of fields) {
    if (!(field in state)) {
      continue;
    }
    if (field === "searchParams") {
      picked.searchParams = Object.fromEntries(
        state.searchParams as URLSearchParams,
      );
    } else if (field === "matches") {
      // 差分の判定に使うのは id と pathname なので、その 2 つだけにする
      picked.matches = (state.matches as { id: string; pathname: string }[]).map(
        (m) => ({ id: m.id, pathname: m.pathname }),
      );
    } else {
      picked[field] = state[field];
    }
  }
  return picked;
}

export function StateInspector({ fields }: { fields: StateField[] }) {
  const { active, pending } = useRouterState();

  return (
    <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
      <summary className="collapse-title text-sm font-medium">
        useRouterState の中身を見る
        <span className="ms-2 font-mono text-xs opacity-50">
          {fields.join(" / ")}
        </span>
      </summary>
      <div className="collapse-content">
        {/* location.key は SSR では "default"、クライアントでは乱数になる。
            値をそのまま出すのが目的なので、ここだけ不一致を許可する */}
        <pre className="overflow-x-auto text-xs" suppressHydrationWarning>
          {JSON.stringify(
            {
              active: pick(active, fields),
              pending: pending ? pick(pending, fields) : null,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </details>
  );
}
