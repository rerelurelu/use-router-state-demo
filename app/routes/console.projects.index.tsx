export default function ProjectsIndex() {
  return (
    <div className="card border border-base-300 bg-base-100 shadow">
      <div className="card-body">
        <p className="opacity-70">左のリストからプロジェクトを選択してください。</p>
        <p className="text-sm opacity-50">
          「概要 ↔ タスク」の切り替えは一番内側の範囲だけがスケルトンに変わります。
        </p>
        <p className="text-sm opacity-50">
          「プロジェクト 1 → 2」への切り替えは見出しごと右カラム全体が差し替わります。
        </p>
        <p className="text-sm opacity-50">
          「プロジェクト → レポート」への切り替えは左ナビ以外の全体が差し替わります。
        </p>
        <p className="text-sm opacity-50">
          差し替わる範囲は active.matches と pending.matches の配列比較で決めています。
          ヘッダのパンくずとページタイトルは各ルートの handle から読み取り、
          遷移が確定する前（loader 完了前）に切り替わります。
          中身のカラムの最大幅も handle の contentWidth で変わります
          （設定と概要は読みやすい幅で止まり、表は全幅になります）。
          サイドバーとヘッダの位置は遷移が起きても動きません。
        </p>
      </div>
    </div>
  );
}
