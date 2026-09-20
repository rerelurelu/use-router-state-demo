// 遷移中の表示を観察できるように入れている擬似的な遅延。
// 実システムのコードではここがネットワーク越しの取得になる
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
