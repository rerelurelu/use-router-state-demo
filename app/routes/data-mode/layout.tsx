import { Link, Outlet, useParams } from "react-router";
import { Card } from "~/components/card";
import { PageShell } from "~/components/page-shell";
import { getArticleList } from "~/data/articles";
import type { Route } from "./+types/layout";

// 一覧API。遅延なし
export async function loader() {
  return { articles: getArticleList() };
}

// 記事詳細の loader が 900ms かかるので、リンクを押してからその間、
// URL も一覧の選択も本文も変わらない。この素の挙動を見せるページなので、
// 画面には解説を置かず、実際のシステムと同じ見た目にしてある
export default function DataModeLayout({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;
  // useParams は URL が確定してから更新される。つまり選択の見た目も
  // loader の完了を待つ。ここがこのページで見せたい挙動そのもの
  const { articleId } = useParams();

  return (
    <PageShell maxWidth="max-w-3xl" title="ナレッジベース">
      <Card>
        <div className="grid grid-cols-[minmax(0,11rem)_1fr] gap-6">
          <nav aria-label="記事一覧" className="flex flex-col gap-2">
            {articles.map((article) => (
              // prefetch は付けない。付けるとホバーの時点で取得が始まり、
              // 押してから待つ時間が見えなくなる
              <Link
                key={article.id}
                to={`/data-mode/${article.id}`}
                aria-current={article.id === articleId ? "page" : undefined}
                className={`btn btn-sm h-auto justify-start py-2 text-left ${
                  article.id === articleId ? "btn-primary" : "btn-ghost"
                }`}
              >
                {article.title}
              </Link>
            ))}
          </nav>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </Card>
    </PageShell>
  );
}
