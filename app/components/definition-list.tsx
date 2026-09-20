// ラベルと値を並べる定義リスト。value を渡さない行はスケルトンになる
export function DefinitionList({
  pending = false,
  children,
}: {
  pending?: boolean;
  children: React.ReactNode;
}) {
  return (
    // 読み込み中はスケルトンを描くので、その旨を読み上げさせる
    <dl
      role={pending ? "status" : undefined}
      className="divide-y divide-base-200"
    >
      {children}
    </dl>
  );
}

export function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 py-1.5">
      <dt className="text-sm opacity-60">{label}</dt>
      {value === undefined ? (
        <dd className="skeleton h-4 w-48 rounded" />
      ) : (
        <dd className="text-sm">{value}</dd>
      )}
    </div>
  );
}
