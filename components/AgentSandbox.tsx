"use client";

import { useState } from "react";
import { SandboxScenario } from "@/lib/types";
import TrajectoryLog from "./TrajectoryLog";

type Stage = "briefing" | "trajectory" | "assess" | "fix" | "resolution";

export default function AgentSandbox({
  scenario,
  onComplete,
}: {
  scenario: SandboxScenario;
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<Stage>("briefing");
  const [assessPick, setAssessPick] = useState<string | null>(null);
  const [fixPick, setFixPick] = useState<string | null>(null);

  const pickedAssessment = scenario.assessmentOptions.find((o) => o.id === assessPick);
  const pickedFix = scenario.fixOptions.find((o) => o.id === fixPick);

  return (
    <div className="space-y-6">
      <StepDots stage={stage} flawed={scenario.isFlawed} />

      {stage === "briefing" && (
        <div className="card space-y-4 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Task given to the agent
            </p>
            <p className="mt-1 font-medium">{scenario.task}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Setup / context provided
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-black/70">
              {scenario.givenContext.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <button className="btn-primary" onClick={() => setStage("trajectory")}>
            Watch the agent work &rarr;
          </button>
        </div>
      )}

      {stage === "trajectory" && (
        <div className="space-y-4">
          <p className="text-sm text-black/60">
            Here is exactly what the agent did, step by step:
          </p>
          <TrajectoryLog steps={scenario.trajectory} />
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Final result
            </p>
            <p className="mt-1 text-sm">{scenario.finalOutput}</p>
          </div>
          <button className="btn-primary" onClick={() => setStage("assess")}>
            Assess this output &rarr;
          </button>
        </div>
      )}

      {stage === "assess" && (
        <div className="card space-y-4 p-5">
          <p className="font-medium">{scenario.assessmentPrompt}</p>
          <div className="space-y-2">
            {scenario.assessmentOptions.map((opt) => {
              const isPicked = assessPick === opt.id;
              let classes = "border-black/10 hover:border-black/30";
              if (assessPick) {
                if (opt.correct) classes = "border-accent2 bg-accent2/10";
                else if (isPicked) classes = "border-danger bg-danger/10";
                else classes = "border-black/10 opacity-60";
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={!!assessPick}
                  onClick={() => setAssessPick(opt.id)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${classes}`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
          {pickedAssessment && (
            <div className="rounded-lg bg-black/5 p-3 text-sm text-black/70">
              <span className="font-semibold">
                {pickedAssessment.correct ? "Correct. " : "Not quite. "}
              </span>
              {pickedAssessment.feedback}
            </div>
          )}
          {pickedAssessment && (
            <button
              className="btn-primary"
              onClick={() => setStage(scenario.isFlawed ? "fix" : "resolution")}
            >
              See what actually happened &rarr;
            </button>
          )}
        </div>
      )}

      {stage === "fix" && (
        <div className="space-y-4">
          <div className="card p-5 text-sm text-black/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Root cause
            </p>
            <p className="mt-1">{scenario.rootCauseExplanation}</p>
          </div>
          <div className="card space-y-4 p-5">
            <p className="font-medium">{scenario.fixPrompt}</p>
            <div className="space-y-2">
              {scenario.fixOptions.map((opt) => {
                const isPicked = fixPick === opt.id;
                let classes = "border-black/10 hover:border-black/30";
                if (fixPick) {
                  if (opt.correct) classes = "border-accent2 bg-accent2/10";
                  else if (isPicked) classes = "border-danger bg-danger/10";
                  else classes = "border-black/10 opacity-60";
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!!fixPick}
                    onClick={() => setFixPick(opt.id)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${classes}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {pickedFix && (
              <div className="rounded-lg bg-black/5 p-3 text-sm text-black/70">
                <span className="font-semibold">{pickedFix.correct ? "Correct. " : "Not quite. "}</span>
                {pickedFix.feedback}
              </div>
            )}
            {pickedFix && (
              <button className="btn-primary" onClick={() => setStage("resolution")}>
                See the corrected run &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {stage === "resolution" && (
        <div className="space-y-4">
          {scenario.isFlawed && (
            <>
              <p className="text-sm text-black/60">
                Same task, corrected setup &mdash; here&rsquo;s the re-run:
              </p>
              <TrajectoryLog steps={scenario.correctedTrajectory} />
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
                  Corrected result
                </p>
                <p className="mt-1 text-sm">{scenario.correctedOutput}</p>
              </div>
            </>
          )}
          <div className="card border-accent/30 bg-accent/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Takeaway
            </p>
            <p className="mt-1 text-sm">{scenario.iterationTakeaway}</p>
          </div>
          <button className="btn-primary" onClick={onComplete}>
            Complete this module &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function StepDots({ stage, flawed }: { stage: Stage; flawed: boolean }) {
  const stages: Stage[] = flawed
    ? ["briefing", "trajectory", "assess", "fix", "resolution"]
    : ["briefing", "trajectory", "assess", "resolution"];
  const labels: Record<Stage, string> = {
    briefing: "Brief",
    trajectory: "Trajectory",
    assess: "Assess",
    fix: "Correct",
    resolution: "Iterate",
  };
  const currentIndex = stages.indexOf(stage);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-black/40">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 ${
              i <= currentIndex ? "bg-ink text-white" : "bg-black/5"
            }`}
          >
            {labels[s]}
          </span>
          {i < stages.length - 1 && <span>&rarr;</span>}
        </div>
      ))}
    </div>
  );
}
