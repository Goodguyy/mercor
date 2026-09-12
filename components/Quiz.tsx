"use client";

import { useMemo, useState } from "react";
import { QuizQuestion } from "@/lib/types";

export default function Quiz({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id]);

  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correctOptionId).length,
    [questions, answers]
  );

  function pick(qId: string, optId: string) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qId]: optId }));
  }

  function handleSubmit() {
    setSubmitted(true);
    onComplete(score, questions.length);
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const picked = answers[q.id];
        return (
          <div key={q.id} className="card p-5">
            <p className="font-medium">
              <span className="text-black/40">Q{i + 1}.</span> {q.prompt}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt) => {
                const isPicked = picked === opt.id;
                const isCorrect = opt.id === q.correctOptionId;
                let stateClasses = "border-black/10 hover:border-black/30";
                if (submitted) {
                  if (isCorrect) {
                    stateClasses = "border-accent2 bg-accent2/10";
                  } else if (isPicked && !isCorrect) {
                    stateClasses = "border-danger bg-danger/10";
                  } else {
                    stateClasses = "border-black/10 opacity-60";
                  }
                } else if (isPicked) {
                  stateClasses = "border-accent bg-accent/5";
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pick(q.id, opt.id)}
                    disabled={submitted}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${stateClasses}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 rounded-lg bg-black/5 p-3 text-sm text-black/70">
                <span className="font-semibold">
                  {picked === q.correctOptionId ? "Correct. " : "Not quite. "}
                </span>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          type="button"
          className="btn-primary"
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          {allAnswered ? "Check answers" : "Answer every question to continue"}
        </button>
      ) : (
        <div className="card flex items-center justify-between p-4">
          <p className="text-sm">
            Score: <span className="font-semibold">{score}</span> / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}
