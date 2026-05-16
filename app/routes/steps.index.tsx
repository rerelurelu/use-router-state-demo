import { redirect } from "react-router";

// /steps はステップ1へ送る
export function loader() {
  return redirect("/steps/1");
}
