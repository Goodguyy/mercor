"use client";

// Progress storage, kept behind a small async interface on purpose.
//
// v1 (this file) persists to localStorage so the app works with zero
// backend. When Supabase is wired in later (per-user accounts), swap
// `localProgressStore` below for a Supabase-backed implementation of
// the same `ProgressStore` interface — nothing in the UI layer
// (useProgress hook, components, pages) needs to change.

export type ModuleProgress = {
  lessonRead: boolean;
  quizScore?: number;
  quizTotal?: number;
  sandboxDone: boolean;
  completedAt?: string;
};

export type ProgressState = Record<string, ModuleProgress>;

export interface ProgressStore {
  load(): Promise<ProgressState>;
  markLessonRead(slug: string): Promise<ProgressState>;
  recordQuiz(slug: string, score: number, total: number): Promise<ProgressState>;
  markSandboxDone(slug: string): Promise<ProgressState>;
  resetAll(): Promise<ProgressState>;
}

const STORAGE_KEY = "agent-academy-progress-v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readRaw(): ProgressState {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressState) : {};
  } catch {
    return {};
  }
}

function writeRaw(state: ProgressState) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // best-effort; ignore quota/serialization errors
  }
}

function emptyModuleProgress(): ModuleProgress {
  return { lessonRead: false, sandboxDone: false };
}

export function isModuleComplete(p: ModuleProgress | undefined): boolean {
  return !!p && p.lessonRead && typeof p.quizScore === "number" && p.sandboxDone;
}

export const localProgressStore: ProgressStore = {
  async load() {
    return readRaw();
  },

  async markLessonRead(slug) {
    const state = readRaw();
    const current = state[slug] ?? emptyModuleProgress();
    const next: ProgressState = {
      ...state,
      [slug]: { ...current, lessonRead: true },
    };
    writeRaw(next);
    return next;
  },

  async recordQuiz(slug, score, total) {
    const state = readRaw();
    const current = state[slug] ?? emptyModuleProgress();
    const updated: ModuleProgress = { ...current, quizScore: score, quizTotal: total };
    const next: ProgressState = { ...state, [slug]: updated };
    if (isModuleComplete(updated) && !updated.completedAt) {
      next[slug] = { ...updated, completedAt: new Date().toISOString() };
    }
    writeRaw(next);
    return next;
  },

  async markSandboxDone(slug) {
    const state = readRaw();
    const current = state[slug] ?? emptyModuleProgress();
    const updated: ModuleProgress = { ...current, sandboxDone: true };
    const next: ProgressState = { ...state, [slug]: updated };
    if (isModuleComplete(updated) && !updated.completedAt) {
      next[slug] = { ...updated, completedAt: new Date().toISOString() };
    }
    writeRaw(next);
    return next;
  },

  async resetAll() {
    writeRaw({});
    return {};
  },
};
