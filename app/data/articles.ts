import { delay } from "~/lib/delay";

// 記事APIの遅延。押してから画面が変わるまでの時間として観察できるようにしている
const DEMO_LATENCY_MS = 900;

export type Article = {
  id: string;
  title: string;
  author: string;
  publishedAt: string;
  body: string;
};

// サーバ側のデータ。モジュール外には公開しない
const articles: Article[] = [
  {
    id: "1",
    title: "テストの粒度をどう決めるか",
    author: "佐藤 健太",
    publishedAt: "2026-08-04",
    body: "1 つのテストで確かめることを 1 つに絞ると、落ちたときに原因の候補が 1 つになる。まとめて確かめたくなるのは、準備のコードを書き直したくないときが多い。",
  },
  {
    id: "2",
    title: "ログ設計の勘所",
    author: "鈴木 美咲",
    publishedAt: "2026-08-12",
    body: "出力する項目を決める前に、そのログを見る場面を書き出す。障害の一次切り分けで見るものと、月次の集計で見るものは別で、後者はログではなく集計基盤の仕事になることが多い。",
  },
  {
    id: "3",
    title: "境界値テストの設計",
    author: "高橋 大輔",
    publishedAt: "2026-08-20",
    body: "仕様の境目そのものと、その 1 つ内側と外側を選ぶ。3 点に絞ると、表の行数を増やさずに抜けを見つけられる。境目が複数あるときは軸ごとに 3 点を取る。",
  },
];

// 一覧API。遅延なし
export function getArticleList(): Pick<Article, "id" | "title">[] {
  return articles.map(({ id, title }) => ({ id, title }));
}

// 詳細API。ここで待つので、遷移はこの時間だけ止まる
export async function getArticle(
  id: string | undefined,
): Promise<Article | undefined> {
  await delay(DEMO_LATENCY_MS);
  return articles.find((a) => a.id === id);
}
