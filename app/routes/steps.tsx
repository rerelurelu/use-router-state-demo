import { Link, Outlet, useNavigate } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";

function StepSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-3">
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

  // スライドの向きはステップ番号の増減で決める。ブラウザの戻る／進むは
  // どちらも POP なので、pending.type だけでは前進か後退かを判別できない。
  // REPLACE（最初からやり直す）は前後の移動ではないのでフェードにする。
  let animClass = "anim-fade";
  if (pending && pending.type !== "REPLACE") {
    const targetStep = Number(pending.params.step ?? 1);
    animClass = targetStep < step ? "anim-back" : "anim-forward";
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="link link-hover text-sm opacity-60">
          ← トップに戻る
        </Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold">
          pending.type デモ（ステップ遷移）
        </h1>

        <div className="card border border-base-300 bg-base-100 shadow">
          <div className="card-body">
            <div className="min-h-[7rem] overflow-hidden">
              {pending ? (
                <div
                  key={pending.location.key}
                  className={animClass}
                >
                  <StepSkeleton />
                </div>
              ) : (
                <Outlet />
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              {/* ステップ1には戻り先のステップが無いので押せなくする。
                  履歴の深さは見ていないため、/steps/2 以降を直接開いた場合は
                  押せる状態のままになる */}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={step <= 1}
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
                    ? {
                        pathname: pending.location.pathname,
                        type: pending.type,
                        step: pending.params.step,
                      }
                    : null,
                  animClass,
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
