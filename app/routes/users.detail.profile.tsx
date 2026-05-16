import { UserFields } from "~/components/user-card";
import { getUserSlow } from "~/data/users";
import type { Route } from "./+types/users.detail.profile";

export async function loader({ params }: Route.LoaderArgs) {
  const user = await getUserSlow(params.userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return { user };
}

export default function ProfileTab({ loaderData }: Route.ComponentProps) {
  return <UserFields detail={loaderData.user} />;
}

// 親レイアウト（名前・タブ）は生かしたまま、タブの中身だけエラー表示にする。
export function ErrorBoundary() {
  return (
    <div className="rounded border border-error p-4">
      <p className="font-medium text-error">プロフィールの読み込みに失敗しました</p>
    </div>
  );
}
