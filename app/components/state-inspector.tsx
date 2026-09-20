import { unstable_useRouterState as useRouterState } from "react-router";

// useRouterState が返す値をそのまま表示する。
// searchParams だけは URLSearchParams で、JSON にすると中身が消えるので
// 平のオブジェクトに直す。残りのキーは変えずにそのまま並べる
function serialize(state: Record<string, unknown>) {
  const { location, searchParams, params, matches, type, ...rest } = state;
  return {
    location,
    searchParams: Object.fromEntries(searchParams as URLSearchParams),
    params,
    matches,
    type,
    ...rest,
  };
}

export function StateInspector() {
  const { active, pending } = useRouterState();

  return (
    <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
      <summary className="collapse-title text-sm font-medium">
        useRouterState の中身を見る
      </summary>
      <div className="collapse-content">
        {/* location.key は SSR では "default"、クライアントでは乱数になる。
            値をそのまま出すのが目的なので、ここだけ不一致を許可する */}
        <pre className="overflow-x-auto text-xs" suppressHydrationWarning>
          {JSON.stringify(
            {
              active: serialize(active),
              pending: pending ? serialize(pending) : null,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </details>
  );
}
