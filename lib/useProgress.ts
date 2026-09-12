"use client";

import { useCallback, useEffect, useState } from "react";
import { localProgressStore, ProgressState } from "./progress";

const store = localProgressStore;

export function useProgress() {
  const [state, setState] = useState<ProgressState>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    store.load().then((s) => {
      setState(s);
      setLoaded(true);
    });
  }, []);

  const markLessonRead = useCallback(async (slug: string) => {
    const next = await store.markLessonRead(slug);
    setState(next);
  }, []);

  const recordQuiz = useCallback(async (slug: string, score: number, total: number) => {
    const next = await store.recordQuiz(slug, score, total);
    setState(next);
  }, []);

  const markSandboxDone = useCallback(async (slug: string) => {
    const next = await store.markSandboxDone(slug);
    setState(next);
  }, []);

  const resetAll = useCallback(async () => {
    const next = await store.resetAll();
    setState(next);
  }, []);

  return { progress: state, loaded, markLessonRead, recordQuiz, markSandboxDone, resetAll };
}
