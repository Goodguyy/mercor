"use client";

import Link from "next/link";
import { modules } from "@/lib/modules";
import { useProgress } from "@/lib/useProgress";
import { isModuleComplete } from "@/lib/progress";

export default function CompletePage() {
  const { progress, loaded } = useProgress();
  const completedCount = modules.filter((m) => isModuleComplete(progress[m.slug])).length;

  return (
    <div className="card mx-auto max-w-xl space-y-4 p-8 text-center">
      <span className="tag bg-accent2/15 text-accent2">Course complete</span>
      <h1 className="text-2xl font-bold tracking-tight">
        You now know how to operate an AI agent.
      </h1>
      <p className="text-sm text-black/60">
        {loaded ? `${completedCount} of ${modules.length}` : "…"} modules
        finished: agents, context, workflow, workspace, trajectory,
        observing &amp; assessing output, and correcting context to iterate.
        That loop &mdash; give it the right context, follow a sound workflow in
        a scoped workspace, watch its trajectory, verify what it actually
        did, and correct and re-run when it&rsquo;s wrong &mdash; is the whole job
        of directing an agent well.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link href="/" className="btn-secondary">
          Review any module
        </Link>
      </div>
    </div>
  );
}
