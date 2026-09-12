"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getModuleBySlug, getNextModule, totalModules } from "@/lib/modules";
import { useProgress } from "@/lib/useProgress";
import Quiz from "@/components/Quiz";
import AgentSandbox from "@/components/AgentSandbox";

type Stage = "lesson" | "quiz" | "sandbox" | "done";

export default function ModulePage() {
  const params = useParams<{ slug: string }>();
  const mod = getModuleBySlug(params.slug);
  const { markLessonRead, recordQuiz, markSandboxDone } = useProgress();
  const [stage, setStage] = useState<Stage>("lesson");
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  if (!mod) {
    return (
      <div className="card p-6">
        <p>That module doesn&rsquo;t exist.</p>
        <Link href="/" className="btn-secondary mt-4 inline-flex">
          &larr; Back to modules
        </Link>
      </div>
    );
  }

  const nextMod = getNextModule(mod.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-black/50 hover:text-ink">
          &larr; All modules
        </Link>
        <span className="text-xs text-black/40">
          Module {mod.order} of {totalModules}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{mod.title}</h1>
        <p className="mt-1 text-black/60">{mod.tagline}</p>
      </div>

      <StageTabs stage={stage} />

      {stage === "lesson" && (
        <div className="space-y-6">
          {mod.lesson.map((section, i) => (
            <div key={i} className="card p-5">
              <h2 className="font-semibold">{section.heading}</h2>
              <div className="mt-2 space-y-2 text-sm text-black/70">
                {section.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="card border-accent/30 bg-accent/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Key takeaways
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              {mod.keyTakeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <button
            className="btn-primary"
            onClick={async () => {
              await markLessonRead(mod.slug);
              setStage("quiz");
            }}
          >
            Take the quiz &rarr;
          </button>
        </div>
      )}

      {stage === "quiz" && (
        <div className="space-y-6">
          <Quiz
            questions={mod.quiz}
            onComplete={async (score, total) => {
              await recordQuiz(mod.slug, score, total);
              setQuizResult({ score, total });
            }}
          />
          {quizResult && (
            <button className="btn-primary" onClick={() => setStage("sandbox")}>
              Continue to the agent sandbox &rarr;
            </button>
          )}
        </div>
      )}

      {stage === "sandbox" && (
        <AgentSandbox
          scenario={mod.sandbox}
          onComplete={async () => {
            await markSandboxDone(mod.slug);
            setStage("done");
          }}
        />
      )}

      {stage === "done" && (
        <div className="card space-y-4 p-6 text-center">
          <p className="text-lg font-semibold">Module complete.</p>
          <p className="text-sm text-black/60">
            {quizResult
              ? `Quiz score: ${quizResult.score}/${quizResult.total}. `
              : ""}
            You&rsquo;ve covered {mod.title.toLowerCase()} end to end &mdash; lesson,
            quiz, and a real sandbox run.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/" className="btn-secondary">
              Back to all modules
            </Link>
            {nextMod && (
              <Link href={`/modules/${nextMod.slug}`} className="btn-primary">
                Next: {nextMod.title} &rarr;
              </Link>
            )}
            {!nextMod && (
              <Link href="/complete" className="btn-primary">
                You finished the course &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StageTabs({ stage }: { stage: Stage }) {
  const stages: { id: Stage; label: string }[] = [
    { id: "lesson", label: "1. Lesson" },
    { id: "quiz", label: "2. Quiz" },
    { id: "sandbox", label: "3. Agent sandbox" },
    { id: "done", label: "4. Complete" },
  ];
  const currentIndex = stages.findIndex((s) => s.id === stage);
  return (
    <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3 text-sm">
      {stages.map((s, i) => (
        <span
          key={s.id}
          className={`rounded-full px-3 py-1 ${
            i <= currentIndex ? "bg-ink text-white" : "bg-black/5 text-black/40"
          }`}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}
