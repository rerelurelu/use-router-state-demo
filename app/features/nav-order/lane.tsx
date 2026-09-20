import { TOTAL_MS, type Step, currentStep } from "./timeline";

const ARTICLES = [
  "テストの粒度をどう決めるか",
  "ログ設計の勘所",
  "境界値テストの設計",
];

// 遷移先として選ぶ記事。一覧の 3 件目
const TARGET_INDEX = 2;

const ARTICLE = {
  title: "境界値テストの設計",
  meta: "高橋 大輔 / 2026-08-20",
  body: "仕様の境目そのものと、その 1 つ内側と外側を選ぶ。3 点に絞ると、表の行数を増やさずに抜けを見つけられる。",
};

type Variant = "spa" | "data";

const TONE: Record<Variant, { text: string; bg: string; border: string }> = {
  spa: {
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning",
  },
  data: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary",
  },
};

export function Lane({
  variant,
  title,
  subtitle,
  steps,
  commitAt,
  elapsed,
  note,
}: {
  variant: Variant;
  title: string;
  subtitle: string;
  steps: Step[];
  // URL と画面が切り替わる時刻
  commitAt: number;
  elapsed: number | null;
  note: string;
}) {
  const tone = TONE[variant];
  const committed = elapsed !== null && elapsed >= commitAt;
  const active = currentStep(steps, elapsed);

  return (
    <section
      className={`card border border-base-300 bg-base-100 shadow border-t-4 ${tone.border}`}
    >
      <div className="card-body gap-4">
        <header className="flex flex-col gap-1">
          <span className={`font-mono text-xs tracking-widest ${tone.text}`}>
            {variant === "spa" ? "MODEL A" : "MODEL B"}
          </span>
          <h2 className="card-title text-lg">{title}</h2>
          <p className="text-sm opacity-60">{subtitle}</p>
        </header>

        <div className="mockup-browser border border-base-300 bg-base-200">
          <div className="mockup-browser-toolbar">
            <div
              className={`input font-mono text-xs ${committed ? tone.text : "opacity-70"}`}
            >
              {committed ? "/articles/3" : "/articles"}
            </div>
          </div>
          <div className="grid min-h-[13rem] grid-cols-[7.5rem_1fr] bg-base-100">
            <ul className="flex flex-col gap-1 border-r border-base-300 p-2">
              {ARTICLES.map((name, i) => (
                <li
                  key={name}
                  className={`rounded px-2 py-1.5 text-[11px] leading-snug ${
                    committed && i === TARGET_INDEX
                      ? `${tone.bg} ${tone.text} font-semibold`
                      : "opacity-70"
                  }`}
                >
                  {name}
                </li>
              ))}
            </ul>
            <div className="p-4">
              <LaneMain variant={variant} elapsed={elapsed} commitAt={commitAt} />
            </div>
          </div>
        </div>

        <Track
          elapsed={elapsed}
          commitAt={commitAt}
          steps={steps}
          tone={tone}
          note={note}
        />

        <ol className="flex flex-col gap-0.5">
          {steps.map((step, i) => {
            const state =
              active === null ? "idle" : i < active ? "done" : i === active ? "now" : "idle";
            return (
              <li
                key={step.text}
                className={`grid grid-cols-[1.25rem_1fr_3.25rem] items-baseline gap-2 rounded px-2 py-1.5 text-xs leading-relaxed ${
                  state === "now"
                    ? `${tone.bg} font-medium`
                    : state === "done"
                      ? "opacity-70"
                      : "opacity-40"
                }`}
              >
                <span className="text-right font-mono text-[10px] opacity-60">
                  {i + 1}
                </span>
                <span>
                  {step.text}
                  {step.note ? (
                    <span className="block text-[11px] opacity-70">{step.note}</span>
                  ) : null}
                </span>
                <span
                  className={`text-right font-mono text-[10px] tabular-nums ${
                    state === "now" ? tone.text : "opacity-50"
                  }`}
                >
                  {step.at}ms
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// 遷移先の中身。SPA は commit 後すぐスケルトンになり、
// Data Mode は commit まで遷移前の表示のまま動かない
function LaneMain({
  variant,
  elapsed,
  commitAt,
}: {
  variant: Variant;
  elapsed: number | null;
  commitAt: number;
}) {
  const done = elapsed !== null && elapsed >= 1180;
  const committed = elapsed !== null && elapsed >= commitAt;

  if (done) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">{ARTICLE.title}</p>
        <p className="font-mono text-[11px] opacity-60">{ARTICLE.meta}</p>
        <p className="text-xs leading-relaxed opacity-80">{ARTICLE.body}</p>
      </div>
    );
  }

  if (variant === "spa" && committed) {
    return (
      <div role="status" className="flex flex-col gap-2">
        <span className="sr-only">読み込み中</span>
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-11/12 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <span className="loading loading-spinner loading-xs mt-1 opacity-60" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-xs opacity-60">左の一覧から記事を選んでください。</p>
      {variant === "data" && elapsed !== null && elapsed >= 80 ? (
        <span className="badge badge-primary badge-outline badge-sm font-mono text-[10px]">
          表示は遷移前のまま
        </span>
      ) : null}
    </div>
  );
}

// 経過を横棒で見せる。縦線は URL と画面が切り替わる時刻
function Track({
  elapsed,
  commitAt,
  steps,
  tone,
  note,
}: {
  elapsed: number | null;
  commitAt: number;
  steps: Step[];
  tone: { text: string; bg: string; border: string };
  note: string;
}) {
  const percent = elapsed === null ? 0 : (elapsed / TOTAL_MS) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-6 overflow-hidden rounded bg-base-200">
        <div
          className={`absolute inset-y-0 left-0 ${tone.bg}`}
          style={{ width: `${percent}%` }}
        />
        {steps.map((step) => (
          <div
            key={step.at}
            className="absolute inset-y-0 border-l border-dashed border-base-content/25"
            style={{ left: `${(step.at / TOTAL_MS) * 100}%` }}
          />
        ))}
        <div
          className={`absolute inset-y-0 border-l-2 ${tone.border}`}
          style={{ left: `${(commitAt / TOTAL_MS) * 100}%` }}
        />
        {elapsed === null ? null : (
          <div
            className="absolute inset-y-0 w-0.5 bg-base-content/70"
            style={{ left: `${percent}%` }}
          />
        )}
      </div>
      <div className="flex justify-between font-mono text-[10px] opacity-50">
        <span>0</span>
        <span>{TOTAL_MS}ms</span>
      </div>
      <p className={`text-xs ${tone.text}`}>{note}</p>
    </div>
  );
}
