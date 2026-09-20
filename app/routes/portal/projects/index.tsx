import { redirect } from "react-router";
import { getProjectList } from "~/data/projects";

// /portal/projects 単体では出すものが無いので、先頭のプロジェクトへ送る
export async function loader() {
  const first = getProjectList()[0];
  if (!first) {
    throw new Response("Not Found", { status: 404 });
  }
  return redirect(`/portal/projects/${first.id}`);
}
