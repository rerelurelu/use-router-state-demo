import { DefinitionList, Field } from "~/components/definition-list";
import { getProjectOverview } from "~/data/projects";
import { type RouteHandle } from "~/features/portal/handle";
import type { Route } from "./+types/overview";

export const handle = {
  title: "概要",
  breadcrumb: "概要",
  contentWidth: "narrow",
  skeleton: "list",
} satisfies RouteHandle;

export async function loader({ params }: Route.LoaderArgs) {
  const project = await getProjectOverview(params.projectId);
  return { project };
}

export default function ProjectOverview({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  return (
    <DefinitionList>
      <Field label="担当者" value={project.owner} />
      <Field label="状態" value={project.status} />
      <Field label="更新日" value={project.updatedAt} />
      <Field label="概要" value={project.summary} />
    </DefinitionList>
  );
}
