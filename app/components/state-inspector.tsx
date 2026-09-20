// 各デモの下に置く useRouterState の中身の表示
export function StateInspector({ data }: { data: unknown }) {
  return (
    <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
      <summary className="collapse-title text-sm font-medium">
        useRouterState の中身を見る
      </summary>
      <div className="collapse-content">
        <pre className="overflow-x-auto text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </details>
  );
}
