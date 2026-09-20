import { useCallback, useEffect, useRef, useState } from "react";

// 再生位置を進めるだけのフック。requestAnimationFrame という
// React の外側の仕組みと同期させるので、ここは useEffect を使う。
// speed は開始時の値が最後まで使われる
export function usePlayback(totalMs: number) {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const frame = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);

  // アンマウント後にコールバックが走らないようにする
  useEffect(() => cancel, [cancel]);

  const start = useCallback(
    (speed: number) => {
      cancel();
      const startedAt = performance.now();
      const tick = (now: number) => {
        const t = (now - startedAt) * speed;
        setElapsed(Math.min(t, totalMs));
        frame.current = t < totalMs ? requestAnimationFrame(tick) : null;
      };
      frame.current = requestAnimationFrame(tick);
    },
    [cancel, totalMs],
  );

  const reset = useCallback(() => {
    cancel();
    setElapsed(null);
  }, [cancel]);

  return {
    elapsed,
    isPlaying: elapsed !== null && elapsed < totalMs,
    start,
    reset,
  };
}
