import { Link, Outlet, useNavigate } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";

function StepSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-6 w-48 rounded" />
      <div className="skeleton h-4 w-full rounded" />
    </div>
  );
}

export default function StepsLayout() {
  const { active, pending } = useRouterState();
  const navigate = useNavigate();

  const step = Number(active.params.step ?? 1);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">pending.type デモ（ステップ遷移）</h1>

        <div className="card border border-base-300 bg-base-100 shadow">
          <div className="card-body">
            <div className="min-h-[7rem] overflow-hidden">
              {pending ? (
                <div
                  key={pending.location.key}
                  className={
                    pending.type === "PUSH" ? "anim-forward" : "anim-fade"
                  }
                >
                  <StepSkeleton />
                </div>
              ) : (
                <Outlet />
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(-1)}
              >
                ← 戻る（POP）
              </button>

              <Link to="/steps/1" replace className="btn btn-ghost btn-sm">
                最初からやり直す（REPLACE）
              </Link>

              {step < 3 ? (
                <Link
                  to={`/steps/${step + 1}`}
                  className="btn btn-primary btn-sm"
                >
                  次へ →（PUSH）
                </Link>
              ) : (
                <span className="btn btn-disabled btn-sm">完了</span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm opacity-60">
          「次へ」（PUSH）のときだけスケルトンが前進方向にスライドします。
          ブラウザの戻る／進むはどちらも POP で区別がつかないため、前進・後退の
          双方向対応は意図的に対象外とし、PUSH 以外はフェードにしています。
          loader を 0.8 秒遅延させているため、コミットまでの間はスケルトンです。
        </p>

        <details className="collapse-arrow collapse mt-6 border border-base-300 bg-base-100">
          <summary className="collapse-title text-sm font-medium">
            useRouterState の中身を見る
          </summary>
          <div className="collapse-content">
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(
                {
                  active: {
                    pathname: active.location.pathname,
                    type: active.type,
                  },
                  pending: pending
                    ? { pathname: pending.location.pathname, type: pending.type }
                    : null,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
