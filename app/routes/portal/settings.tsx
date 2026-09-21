import { getSettings } from "~/data/projects";
import { type RouteHandle } from "~/features/portal/handle";
import type { Route } from "./+types/settings";

export const handle = {
  title: "設定",
  breadcrumb: "設定",
  contentWidth: "narrow",
  skeleton: "list",
} satisfies RouteHandle;

export async function loader() {
  const settings = await getSettings();
  return { settings };
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { settings } = loaderData;
  return (
    <ul className="flex flex-col divide-y divide-base-200">
      {settings.map((item) => (
        <li key={item.id} className="flex justify-between py-2 text-sm">
          <span className="opacity-60">{item.label}</span>
          <span>{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
