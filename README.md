# Agent Academy

An interactive course that teaches a complete beginner how to actually operate
an AI agent — not just prompt one. Built as a Mercor take-home assessment on
AI agents.

## What it teaches

Seven modules, each with a short lesson, a quiz, and a hands-on simulated
agent-run sandbox you have to observe, assess, and correct yourself:

1. **AI Agents** — what makes something an agent vs. a plain chatbot
2. **Context** — the agent's entire world is what's in its context window
3. **Workflow** — the intended steps, order, and checkpoints for a task
4. **Workspace** — the files/tools/permissions an agent can actually reach
5. **Trajectory** — the real path an agent took, which can drift from the plan
6. **Observe & Assess Output** — checking evidence, not the agent's self-report
7. **Correct Context & Iterate** — diagnosing the real cause and re-running

Every sandbox follows the same shape: see the task and the context/setup the
agent was given, watch its real trajectory (thoughts/actions/observations),
assess whether the output should be trusted, see the root cause when it's
wrong, choose the correct fix, and see the corrected re-run.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS. No backend yet —
progress is stored in the browser via `localStorage` behind a small
`ProgressStore` interface (`lib/progress.ts`) so it's a one-file swap to a
Supabase-backed store once accounts/sign-up are added for the SaaS version.

## Running locally

```bash
npm install
npm run dev
```

## Structure

- `lib/types.ts` — content types (modules, quiz questions, sandbox scenarios)
- `lib/modules.ts` — all course content, one entry per module
- `lib/progress.ts` / `lib/useProgress.ts` — progress storage + React hook
- `components/` — Quiz, AgentSandbox, TrajectoryLog, ModuleCard, ProgressBar
- `app/page.tsx` — dashboard listing modules with progress
- `app/modules/[slug]/page.tsx` — the lesson → quiz → sandbox flow per module
- `app/complete/page.tsx` — end-of-course summary
