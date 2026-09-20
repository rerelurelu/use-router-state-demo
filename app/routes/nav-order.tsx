import { useState } from "react";
import { PageShell } from "~/components/page-shell";
import { Lane } from "~/features/nav-order/lane";
import {
  DATA_COMMIT_MS,
  DATA_STEPS,
  SPA_COMMIT_MS,
  SPA_STEPS,
  TOTAL_MS,
} from "~/features/nav-order/timeline";
import { usePlayback } from "~/features/nav-order/use-playback";

const SPEEDS = [
  { label: "1x", value: 1 },
  { label: "0.35x", value: 0.35 },
];

export default function NavOrder() {
  const { elapsed, isPlaying, start, reset } = usePlayback(TOTAL_MS);
  const [speed, setSpeed] = useState(1);

  // 速度を変えると時間割の途中で辻褄が合わなくなるので、最初に戻す
  const changeSpeed = (value: number) => {
    setSpeed(value);
    reset();
  };

  return (
    <PageShell
      maxWidth="max-w-6xl"
      title="render が先か、loader が先か"
      description="同じ「記事一覧から記事詳細へ移る」操作を 2 つのモデルで同時に走らせます。取得にかかる時間はどちらも 900ms で揃えてあり、違うのは取得を始めるタイミングだけです。"
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-4">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={isPlaying}
          onClick={() => start(speed)}
        >
          {elapsed === null ? "両方いっせいに実行" : "もう一度実行"}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={reset}
          disabled={elapsed === null}
        >
          最初に戻す
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs opacity-60">速度</span>
          {SPEEDS.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={speed === item.value}
              className={`btn btn-xs font-mono ${
                speed === item.value ? "btn-neutral" : "btn-ghost"
              }`}
              onClick={() => changeSpeed(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="ms-auto font-mono text-sm tabular-nums opacity-70">
          経過{" "}
          <span className="font-medium opacity-100">
            {elapsed === null ? 0 : Math.round(elapsed)}
          </span>{" "}
          ms
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Lane
          variant="spa"
          title="一般的な SPA"
          subtitle="render してから、Component 側で取得する"
          steps={SPA_STEPS}
          commitAt={SPA_COMMIT_MS}
          elapsed={elapsed}
          note="画面が切り替わるのは 160ms 時点。そこから約 1,000ms がスピナー"
        />
        <Lane
          variant="data"
          title="Data Mode"
          subtitle="loader で取得してから、render する"
          steps={DATA_STEPS}
          commitAt={DATA_COMMIT_MS}
          elapsed={elapsed}
          note="画面が切り替わるのは 1120ms 時点。それまで表示は動かない"
        />
      </div>

      <section className="card border border-base-300 bg-base-100 shadow">
        <div className="card-body gap-3">
          <h2 className="card-title text-lg">
            違いは、取得を始める前に render するかどうか
          </h2>
          <p className="text-sm leading-relaxed opacity-80">
            A は遷移先の Component を先に render するので、URL と画面は 160ms
            で切り替わります。ただしその時点でデータは無いので、残りの約 1,000ms
            はスピナーかスケルトンを出すことになります。B は loader の完了を待ってから
            遷移を commit するので、URL も画面も 1120ms まで動きません。
            切り替わったときには中身が入っています。
          </p>
          <p className="text-sm leading-relaxed opacity-80">
            B の 1120ms は、押しても何も起きない時間になります。
            裏を返すと、遷移が確定する前の状態をルータが持っているということでもあります。
          </p>
          <p className="text-xs opacity-50">
            この 2 つは同じ時間割で再現したもので、左側は React Router
            の実際の動作ではありません。取得にかかる時間を揃えて、
            画面が切り替わる時刻だけを比べています。
          </p>
        </div>
      </section>
    </PageShell>
  );
}
