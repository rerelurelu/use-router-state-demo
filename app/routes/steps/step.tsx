import { delay } from "~/lib/delay";
import type { Route } from "./+types/step";

const DEMO_LATENCY_MS = 800;

const STEPS: Record<string, { title: string; body: string }> = {
  "1": {
    title: "プロフィール入力",
    body: "氏名と連絡先を入力します。ウィザードの最初のステップです。",
  },
  "2": {
    title: "支払い方法",
    body: "クレジットカードまたは銀行振込を選択します。",
  },
  "3": {
    title: "確認",
    body: "入力内容を確認して送信します。最後のステップです。",
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const content = STEPS[params.step ?? ""];
  if (!content) {
    throw new Response("Not Found", { status: 404 });
  }
  await delay(DEMO_LATENCY_MS);
  return { step: Number(params.step), ...content };
}

export default function Step({ loaderData }: Route.ComponentProps) {
  const { step, title, body } = loaderData;
  return (
    <div>
      <p className="text-sm opacity-60">ステップ {step} / 3</p>
      <h2 className="mt-1 text-xl font-bold">{title}</h2>
      <p className="mt-4 leading-relaxed opacity-80">{body}</p>
    </div>
  );
}
