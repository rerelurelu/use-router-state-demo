import { PAGE_SIZE, type Product } from "~/data/products";

export function ProductList({
  items,
  total,
}: {
  items: Product[];
  total: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs opacity-60">{total} 件</p>
      <ul className="divide-y divide-base-200">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-2.5 text-sm">
            <span>{item.name}</span>
            <span className="font-mono tabular-nums opacity-70">
              ¥{item.price.toLocaleString("ja-JP")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 遷移後に現れる一覧と同じ行数・同じ高さにして、切り替わったときに
// レイアウトが動かないようにする
export function ProductListSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-2">
      <span className="sr-only">読み込み中</span>
      <div className="skeleton h-4 w-12 rounded" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <div key={i} className="skeleton h-9 w-full rounded" />
        ))}
      </div>
    </div>
  );
}
