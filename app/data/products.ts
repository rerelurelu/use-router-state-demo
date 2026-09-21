import { delay } from "~/lib/delay";

// 一覧APIの遅延。遷移中の表示を観察できるようにしている
const DEMO_LATENCY_MS = 900;

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export const CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "kitchen", label: "キッチン" },
  { id: "furniture", label: "家具" },
  { id: "appliance", label: "家電" },
];

export const PAGE_SIZE = 4;

// サーバ側のデータ。モジュール外には公開しない
const products: Product[] = [
  { id: "1", name: "片手鍋 18cm", category: "kitchen", price: 4800 },
  { id: "2", name: "木製まな板", category: "kitchen", price: 3200 },
  { id: "3", name: "計量カップ 500ml", category: "kitchen", price: 900 },
  { id: "4", name: "鋳鉄フライパン 24cm", category: "kitchen", price: 7600 },
  { id: "5", name: "保存容器 4個セット", category: "kitchen", price: 2400 },
  { id: "6", name: "ダイニングチェア", category: "furniture", price: 18000 },
  { id: "7", name: "オーク材のデスク", category: "furniture", price: 42000 },
  { id: "8", name: "本棚 5段", category: "furniture", price: 23000 },
  { id: "9", name: "スツール", category: "furniture", price: 9800 },
  { id: "10", name: "電気ケトル 1.0L", category: "appliance", price: 6800 },
  { id: "11", name: "オーブントースター", category: "appliance", price: 11800 },
  { id: "12", name: "ハンドブレンダー", category: "appliance", price: 8900 },
];

export type ProductPage = {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
};

// 一覧API。カテゴリで絞り込んでページ単位で返す
export async function getProducts(
  category: string,
  page: number,
): Promise<ProductPage> {
  await delay(DEMO_LATENCY_MS);

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // 範囲外のページ番号を URL で直接指定されても落ちないようにする
  const current = Math.min(Math.max(page, 1), totalPages);

  return {
    items: filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    total: filtered.length,
    page: current,
    totalPages,
  };
}
