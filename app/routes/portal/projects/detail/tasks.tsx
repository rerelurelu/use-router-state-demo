import { getProjectTasks } from "~/data/projects";
import { type RouteHandle } from "~/features/portal/handle";
import type { Route } from "./+types/tasks";

export const handle = {
  title: "タスク",
  breadcrumb: "タスク",
  contentWidth: "full",
  skeleton: "table",
} satisfies RouteHandle;

export async function loader({ params }: Route.LoaderArgs) {
  const tasks = await getProjectTasks(params.projectId);
  return { tasks };
}

export default function ProjectTasks({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>タスク</th>
            <th>担当</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.assignee}</td>
              <td>{task.done ? "完了" : "未完了"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
