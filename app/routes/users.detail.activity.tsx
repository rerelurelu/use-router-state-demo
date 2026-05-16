import { getUserActivity } from "~/data/users";
import type { Route } from "./+types/users.detail.activity";

export async function loader({ params }: Route.LoaderArgs) {
  const activity = await getUserActivity(params.userId);
  return { activity };
}

export default function ActivityTab({ loaderData }: Route.ComponentProps) {
  const { activity } = loaderData;

  if (activity.length === 0) {
    return <p className="text-sm opacity-60">活動履歴はありません。</p>;
  }

  return (
    <ul className="divide-y divide-base-200">
      {activity.map((entry) => (
        <li key={entry.id} className="flex gap-4 py-2 text-sm">
          <span className="opacity-60 tabular-nums">{entry.date}</span>
          <span>{entry.action}</span>
        </li>
      ))}
    </ul>
  );
}
