import { useSearchParams } from "react-router";
import { Card } from "~/components/card";
import { PageShell } from "~/components/page-shell";
import { StateInspector } from "~/components/state-inspector";
import { CATEGORIES, getProducts } from "~/data/products";
import { PendingProductList } from "~/features/products/pending-list";
import type { Route } from "./+types/products";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? "all";
  const page = Number(url.searchParams.get("page") ?? "1");
  return await getProducts(category, page);
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { items, total, page, totalPages } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";

  // カテゴリは続けて押されるので履歴に積まない。積むと、戻るたびに
  // 過去の絞り込み条件を 1 つずつ辿ることになる
  const changeCategory = (next: string) => {
    setSearchParams({ category: next, page: "1" }, { replace: true });
  };

  // ページ送りは「2ページ目を見てから戻るで1ページ目へ」が自然なので履歴に積む
  const goToPage = (next: number) => {
    setSearchParams({ category, page: String(next) });
  };

  return (
    <PageShell maxWidth="max-w-2xl" title="商品一覧">
      <Card>
        <nav aria-label="カテゴリ" className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === category}
              className={`btn btn-sm ${
                item.id === category ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => changeCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-2 min-h-[13rem]">
          <PendingProductList items={items} total={total} />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            ← 前へ
          </button>
          <span className="font-mono text-xs tabular-nums opacity-60">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            次へ →
          </button>
        </div>
      </Card>

      <StateInspector fields={["type"]} />
    </PageShell>
  );
}
