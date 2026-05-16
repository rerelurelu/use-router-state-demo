export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">useRouterState Demo</h1>
      <a href="/users" className="btn btn-primary">
        デモを見る
      </a>
    </div>
  );
}
