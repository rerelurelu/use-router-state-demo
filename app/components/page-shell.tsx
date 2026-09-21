import { Link } from "react-router";

// トップへ戻るリンク。行き先とラベルをここ 1 箇所に置く
export function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`link link-hover ${className}`}>
      ← トップに戻る
    </Link>
  );
}

// サイドバーを持たないデモの外枠。中身の最大幅はデモごとに違うので受け取る
export function PageShell({
  maxWidth,
  title,
  description,
  children,
}: {
  maxWidth: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className={`mx-auto flex ${maxWidth} flex-col gap-6`}>
        <header>
          <BackLink className="text-sm opacity-60" />
          <h1 className="mt-2 text-2xl font-bold">{title}</h1>
          {description && (
            <p className="mt-2 text-sm opacity-70">{description}</p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
