import { getArticle } from "~/data/articles";
import type { Route } from "./+types/article";

// 900ms かかる。この loader が終わるまで遷移は確定しない
export async function loader({ params }: Route.LoaderArgs) {
  const article = await getArticle(params.articleId);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return { article };
}

export default function ArticleDetail({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData;
  return (
    <article className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">{article.title}</h2>
      <p className="text-sm leading-relaxed opacity-80">{article.body}</p>
    </article>
  );
}
