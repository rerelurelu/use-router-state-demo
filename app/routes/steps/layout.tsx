import { Link, Outlet, useNavigate } from "react-router";
import { unstable_useRouterState as useRouterState } from "react-router";
import { Card } from "~/components/card";
import { PageShell } from "~/components/page-shell";
import { StateInspector } from "~/components/state-inspector";

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
    <PageShell maxWidth="max-w-xl" title="pending.type デモ（ステップ遷移）">
      <Card>
        <div className="min-h-[7rem] overflow-hidden">
          {pending ? (
            <div key={pending.location.key} className={animClass}>
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
            <Link to={`/steps/${step + 1}`} className="btn btn-primary btn-sm">
              次へ →（PUSH）
            </Link>
          ) : (
            <span className="btn btn-disabled btn-sm">完了</span>
          )}
        </div>
      </Card>

      <StateInspector fields={["type"]} />
    </PageShell>
  );
}
