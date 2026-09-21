import { unstable_useRouterState as useRouterState } from "react-router";
import type { Product } from "~/data/products";
import { ProductList, ProductListSkeleton } from "./product-list";

// 遷移中に一覧をどう見せるかを pending.type だけで決める。
// この対応は React Router が決めているものではなく、この画面の設計判断
export function PendingProductList({
  items,
  total,
}: {
  items: Product[];
  total: number;
}) {
  const { pending } = useRouterState();

  if (!pending) {
    return <ProductList items={items} total={total} />;
  }

  switch (pending.type) {
    // ページ送り。中身が全部入れ替わるので、来ることを示す
    case "PUSH":
      return <ProductListSkeleton />;

    // 絞り込み。条件を変えただけなので、見ていた一覧は残す
    case "REPLACE":
      return (
        <div className="opacity-40">
          <ProductList items={items} total={total} />
        </div>
      );

    // 戻る・進む。一度見た内容なので中身には触れず、進行中だとだけ伝える
    case "POP":
      return (
        <div className="flex flex-col gap-2">
          <progress className="progress progress-primary h-1 w-full" />
          <ProductList items={items} total={total} />
        </div>
      );
  }
}
