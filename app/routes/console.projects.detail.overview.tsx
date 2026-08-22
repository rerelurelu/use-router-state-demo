import { getProjectOverview } from "~/data/projects";
import { type RouteHandle } from "~/lib/pending-scope";
import type { Route } from "./+types/console.projects.detail.overview";

export const handle = {
  title: "概要",
  breadcrumb: "概要",
  contentWidth: "narrow",
  skeleton: "card",
} satisfies RouteHandle;

export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProjectOverview(params.projectId);
  return { project };
}

export default function ProjectOverview({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  return (
    <dl className="divide-y divide-base-200">
      <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
        <dt className="text-sm opacity-60">担当者</dt>
        <dd className="text-sm">{project.owner}</dd>
      </div>
      <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
        <dt className="text-sm opacity-60">状態</dt>
        <dd className="text-sm">{project.status}</dd>
      </div>
      <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
        <dt className="text-sm opacity-60">更新日</dt>
        <dd className="text-sm">{project.updatedAt}</dd>
      </div>
      <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
        <dt className="text-sm opacity-60">概要</dt>
        <dd className="text-sm">{project.summary}</dd>
      </div>
    </dl>
  );
}
