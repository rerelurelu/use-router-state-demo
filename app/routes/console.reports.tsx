import { getReportRows } from "~/data/projects";
import { type RouteHandle } from "~/lib/pending-scope";
import type { Route } from "./+types/console.reports";

export const handle = {
  title: "レポート",
  breadcrumb: "レポート",
  contentWidth: "full",
  skeleton: "table",
} satisfies RouteHandle;

export async function loader() {
  const rows = await getReportRows();
  return { rows };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
  const { rows } = loaderData;
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>項目</th>
            <th>値</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
