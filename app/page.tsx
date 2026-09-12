"use client";

import { modules, totalModules } from "@/lib/modules";
import { isModuleComplete } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import ModuleCard from "@/components/ModuleCard";
import ProgressBar from "@/components/ProgressBar";

export default function Dashboard() {
  const { progress, loaded, resetAll } = useProgress();

  const completedCount = modules.filter((m) => isModuleComplete(progress[m.slug])).length;
  const percent = totalModules ? (completedCount / totalModules) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="card space-y-4 p-6 sm:p-8">
        <span className="tag bg-accent/10 text-accent">Mercor Assessment Build</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Learn to actually operate an AI agent, not just prompt one.
        </h1>
        <p className="max-w-2xl text-black/60">
          Seven short modules, each with a lesson, a quiz, and a hands-on
          simulated agent run you have to observe, assess, and correct
          yourself. By the end you&rsquo;ll know how to reason about context,
          workflow, workspace, and trajectory &mdash; the things that actually
          separate a good agent run from a bad one.
        </p>
        <div className="max-w-md space-y-2">
          <div className="flex items-center justify-between text-sm text-black/60">
            <span>Your progress</span>
            <span>
              {loaded ? completedCount : "…"} / {totalModules} modules
            </span>
          </div>
          <ProgressBar percent={loaded ? percent : 0} />
        </div>
      </section>

      <section className="space-y-3">
        {modules.map((mod, idx) => {
          const prev = modules[idx - 1];
          const locked = !!prev && !isModuleComplete(progress[prev.slug]);
          return (
            <ModuleCard
              key={mod.slug}
              mod={mod}
              progress={progress[mod.slug]}
              locked={loaded ? locked : idx !== 0}
            />
          );
        })}
      </section>

      {loaded && completedCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (window.confirm("Reset all progress? This can't be undone.")) {
                resetAll();
              }
            }}
            className="text-xs text-black/40 underline hover:text-black/60"
          >
            Reset progress
          </button>
        </div>
      )}
    </div>
  );
}
