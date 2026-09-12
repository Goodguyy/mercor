import { AgentModule } from "./types";

// The seven concepts a complete novice needs, in the order an agent
// actually loops through them: what an agent is, the context you hand
// it, the workflow it should follow, the workspace it acts inside,
// the trajectory it actually takes, how you observe/assess what it
// produced, and how you correct context and iterate when it's wrong.

export const modules: AgentModule[] = [
  // ------------------------------------------------------------------
  // 1. AI AGENTS
  // ------------------------------------------------------------------
  {
    slug: "agents",
    order: 1,
    title: "What Is an AI Agent?",
    tagline: "The difference between a chatbot that replies and a system that acts.",
    concept: "agents",
    readingMinutes: 4,
    lesson: [
      {
        heading: "A chatbot answers. An agent acts.",
        body: [
          "A plain chatbot takes your message, produces a reply, and stops. It has no way to check a fact, run a calculation for real, or change anything in the outside world — it can only generate text based on what it already knows.",
          "An AI agent is a model wrapped in a loop: it can call tools (read a file, run code, search the web, hit an API, send an email), look at what those tools return, and decide what to do next — repeating that cycle until the goal is met or it decides to stop.",
        ],
      },
      {
        heading: "The agent loop",
        body: [
          "Almost every agent, however it's branded, runs some version of the same loop: understand the goal → decide the next action → take that action with a real tool → observe the real result → decide again. That loop is what turns a language model from an author into an operator.",
          "Autonomy is a spectrum, not a switch. A form-filling assistant that only ever calls one lookup tool once is still technically 'agentic.' A coding agent that plans a multi-file refactor, runs your test suite, reads the failures, and patches its own mistakes is much further along that spectrum. What matters for this course is not the label — it's whether the system can act, observe the real result of that action, and adjust.",
        ],
      },
      {
        heading: "Why this distinction matters",
        body: [
          "Once a system can act on the world instead of just describing it, everything downstream changes: what you feed it (context) determines what it's capable of noticing; how it's supposed to behave (workflow) determines whether its actions happen in a sane order; what it's allowed to touch (workspace) determines the blast radius of a mistake; the actual path it takes (trajectory) can drift from that intended workflow; and because it can now produce real side effects, you can no longer just skim the final reply — you have to check what actually happened (observe & assess) and be ready to step back in (correct & iterate).",
          "The rest of this course is those five ideas, one module each.",
        ],
      },
    ],
    keyTakeaways: [
      "A chatbot produces a single reply from what it already knows; an agent can call tools, see real results, and decide what to do next.",
      "The agent loop is: understand goal → act → observe the real outcome → decide again.",
      "Autonomy is a spectrum — one tool call still counts, a long multi-step run is further along the same spectrum.",
      "Because agents produce real side effects, every later module (context, workflow, workspace, trajectory, assessment, iteration) matters in a way it wouldn't for a plain chatbot.",
    ],
    quiz: [
      {
        id: "agents-q1",
        prompt:
          "A support tool reads an incoming ticket and drafts a reply for a human to review and send. It never sends anything itself and has no tools. Is this an AI agent?",
        options: [
          { id: "a", text: "Yes — it's reasoning about a real ticket, so it's agentic." },
          { id: "b", text: "No — it only generates text; it never acts on or observes the outside world." },
          { id: "c", text: "Yes, because support work is a business process." },
          { id: "d", text: "It's impossible to tell without knowing the model size." },
        ],
        correctOptionId: "b",
        explanation:
          "It behaves exactly like a plain chatbot: input in, text out, nothing acted on and nothing observed. Add a tool call — say, 'look up this customer's order history' — and the moment it uses that tool's real result to decide what to write, it becomes agentic.",
      },
      {
        id: "agents-q2",
        prompt: "What is the core loop that defines an agent, as distinct from a single-turn model call?",
        options: [
          { id: "a", text: "Bigger model → longer answer" },
          { id: "b", text: "Prompt → single reply → done" },
          { id: "c", text: "Understand goal → act via a tool → observe the real result → decide the next action" },
          { id: "d", text: "Ask the user more clarifying questions before ever acting" },
        ],
        correctOptionId: "c",
        explanation:
          "That repeatable act → observe → decide cycle is what lets an agent adapt mid-task instead of committing to one guess up front.",
      },
      {
        id: "agents-q3",
        prompt: "Why does 'the model can act on the world' raise the stakes compared to a chatbot?",
        options: [
          { id: "a", text: "It doesn't — output is output either way." },
          { id: "b", text: "Because actions can have real, sometimes irreversible side effects (sent emails, deployed code, modified data), so you have to check what actually happened, not just how the reply reads." },
          { id: "c", text: "Because agents always require more GPU memory." },
          { id: "d", text: "Because agents can't be stopped mid-task." },
        ],
        correctOptionId: "b",
        explanation:
          "A wrong chatbot reply just sits in the chat. A wrong agent action can send the wrong email or delete the wrong file — which is exactly why the later modules on workspace, observation, and iteration exist.",
      },
    ],
    sandbox: {
      task:
        "\"Find the average order value from sales.csv and send the team a one-line summary.\"",
      givenContext: [
        "System A (chatbot): the raw request above, typed into a chat box. No file attached, no tools available.",
        "System B (agent): the same request, plus a file-read tool pointed at sales.csv and an email-send tool.",
      ],
      trajectory: [
        { kind: "thought", content: "System A: I don't have access to any file, but the user wants a number." },
        { kind: "output", content: "System A's reply: \"Based on typical e-commerce data, your average order value is likely around $45–60. Let me know if you'd like a more precise figure!\"" },
        { kind: "thought", content: "System B: I need the real numbers before I can report anything." },
        { kind: "action", content: "System B calls read_file(\"sales.csv\")" },
        { kind: "observation", content: "File returned: 1,204 orders, total revenue $58,392.17" },
        { kind: "action", content: "System B computes 58392.17 / 1204 = 48.50, then calls send_email(team, \"Avg order value this period: $48.50 across 1,204 orders.\")" },
        { kind: "observation", content: "Email tool returned: sent successfully to 6 recipients." },
        { kind: "output", content: "System B's reply to the user: \"Done — average order value is $48.50 across 1,204 orders. Sent to the team.\"" },
      ],
      finalOutput:
        "System A guessed a plausible-sounding number with no data behind it. System B read the real file, computed the real figure, and actually sent the email.",
      isFlawed: true,
      assessmentPrompt: "Which system actually behaved as an agent, and why?",
      assessmentOptions: [
        {
          id: "a",
          text: "Both did — they both answered the question that was asked.",
          correct: false,
          feedback: "Answering the words of the question isn't the bar. System A never touched real data or produced a real side effect — it pattern-matched to a plausible-sounding number.",
        },
        {
          id: "b",
          text: "System B — it read the real file, computed from real numbers, and confirmed the email actually sent.",
          correct: true,
          feedback: "Exactly. System B closed the loop: it acted on the real world (read the file, sent the email) and observed the real results (the actual total, the actual send confirmation) instead of guessing.",
        },
        {
          id: "c",
          text: "System A — it responded faster.",
          correct: false,
          feedback: "Speed isn't the distinction. System A's speed came from skipping the step that would have made its answer true.",
        },
        {
          id: "d",
          text: "Neither — 'average order value' is too simple a task for either to count as agentic.",
          correct: false,
          feedback: "Task complexity isn't what makes something agentic. Even a simple task counts once the system acts via a tool and uses the real result — which is exactly what System B did.",
        },
      ],
      rootCauseExplanation:
        "System A had no tools and no data, so it did the only thing a plain chatbot can do: pattern-match to a plausible-sounding number and present it fluently. That confidence is the trap — the sentence reads fine, but nothing behind it is real. System B is the same underlying model with one difference: it had tools, so it could act and observe instead of guess.",
      fixPrompt:
        "If all you could change was System A's setup (not the model itself), what single change would make it capable of a truthful answer?",
      fixOptions: [
        {
          id: "a",
          text: "Tell it to 'try harder to be accurate' in the prompt.",
          correct: false,
          feedback: "Instructing a tool-less model to be more accurate doesn't give it any data to be accurate about — it will still be guessing, just with more hedging language.",
        },
        {
          id: "b",
          text: "Give it a file-read tool pointed at sales.csv, so it can compute the real figure before answering.",
          correct: true,
          feedback: "Right — the missing ingredient was never effort or wording, it was the ability to act (read real data) and observe the real result before producing an answer.",
        },
        {
          id: "c",
          text: "Ask it to generate three guesses and average them.",
          correct: false,
          feedback: "Averaging three guesses still produces a guess — with no ground truth in the loop, more guessing doesn't converge on the truth.",
        },
        {
          id: "d",
          text: "Use a larger, more capable model.",
          correct: false,
          feedback: "A bigger model without access to sales.csv will still have no way to know the real total — model scale doesn't substitute for real data access.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "System A (fixed) calls read_file(\"sales.csv\")" },
        { kind: "observation", content: "File returned: 1,204 orders, total revenue $58,392.17" },
        { kind: "output", content: "\"Average order value: $48.50 across 1,204 orders.\"" },
      ],
      correctedOutput:
        "With a tool added, System A now produces the same grounded answer System B did — because it's the tool, not the wording of the prompt, that turned a guess into a fact.",
      iterationTakeaway:
        "The lesson generalizes past this one example: when output is wrong or unfounded, ask first whether the system had the *ability* to get it right (a tool, a data source, a permission) before assuming it needs a better prompt.",
    },
  },

  // ------------------------------------------------------------------
  // 2. CONTEXT
  // ------------------------------------------------------------------
  {
    slug: "context",
    order: 2,
    title: "Context",
    tagline: "Everything the agent can see is everything it can reason about — nothing else exists to it.",
    concept: "context",
    readingMinutes: 5,
    lesson: [
      {
        heading: "Context is the agent's entire world",
        body: [
          "At the moment it decides what to do next, an agent only knows what's inside its context window: the system instructions, the conversation so far, any files or data it's been shown, and the results of any tools it has already called. It has no access to anything outside that — not your intentions, not the parts of the codebase it hasn't read, not the meeting where the requirements were actually decided.",
          "This is why the single most common cause of a bad agent run isn't a 'dumb model' — it's a context problem: the agent was missing something it needed, was given something wrong, or was drowning in something irrelevant.",
        ],
      },
      {
        heading: "Three ways context goes wrong",
        body: [
          "Too little: the agent is asked to 'fix the bug' with no error message, no file, no repro steps — so it has to invent a plausible-sounding fix instead of a correct one.",
          "Too much / irrelevant: dumping an entire codebase, a year of chat history, or every table in a database into context doesn't help — it buries the one relevant fact in noise, and every model has a finite context window it can effectively reason over.",
          "Wrong or stale: a file was pasted in before someone else edited it; a spec describes last month's requirements; a variable name in the instructions doesn't match the real one in the file. The agent will confidently act on stale or incorrect context because it has no way to know it's stale.",
        ],
      },
      {
        heading: "Good context is curated, not maximal",
        body: [
          "The skill isn't 'give the agent everything' — it's giving it the smallest set of accurate, relevant, current information needed to do the task: the actual error, the actual file, the actual constraint, the actual definition of 'done.' That's the difference between context and noise.",
        ],
      },
    ],
    keyTakeaways: [
      "An agent can only reason about what's literally inside its context window — nothing more.",
      "Bad context comes in three shapes: too little, too much/irrelevant, or wrong/stale.",
      "Curated, accurate, current context beats maximal context — dumping everything in buries the signal.",
      "Most 'the model got it wrong' failures are actually 'the context was wrong' failures.",
    ],
    quiz: [
      {
        id: "context-q1",
        prompt: "A coding agent is told only \"fix the bug in checkout.js\" with no file contents and no error message. What's the most likely outcome?",
        options: [
          { id: "a", text: "It will ask a clarifying question every time." },
          { id: "b", text: "It will invent a plausible-looking fix for a bug it can't actually see." },
          { id: "c", text: "It will refuse to respond." },
          { id: "d", text: "It will correctly infer the bug from the filename alone." },
        ],
        correctOptionId: "b",
        explanation:
          "With no file and no error, the agent has nothing to ground a fix in, so it will typically produce something confident-sounding but disconnected from the actual bug.",
      },
      {
        id: "context-q2",
        prompt: "Why can pasting an entire large codebase into an agent's context actually hurt, rather than help, a specific task?",
        options: [
          { id: "a", text: "It never hurts — more context is strictly better." },
          { id: "b", text: "It can bury the one relevant file or fact in irrelevant noise, and it competes for a finite context window." },
          { id: "c", text: "Agents are physically incapable of reading more than one file." },
          { id: "d", text: "It causes the tool-calling API to reject the request outright." },
        ],
        correctOptionId: "b",
        explanation:
          "Context windows are finite and attention is a limited resource — irrelevant material dilutes the signal the agent needs to find and use correctly.",
      },
      {
        id: "context-q3",
        prompt: "A spec document pasted into context describes a feature as it was planned last month, but the requirements changed since. What kind of context problem is this?",
        options: [
          { id: "a", text: "Too little context" },
          { id: "b", text: "Too much context" },
          { id: "c", text: "Stale/wrong context" },
          { id: "d", text: "Not a context problem — this is a model limitation" },
        ],
        correctOptionId: "c",
        explanation:
          "The agent has no way to know the spec is outdated — it will confidently build to the stale version unless someone gives it the current requirements.",
      },
    ],
    sandbox: {
      task: "\"Fix the bug in checkout.js — customers say checkout is broken.\"",
      givenContext: [
        "No file contents provided.",
        "No error message or stack trace provided.",
        "No steps to reproduce provided.",
      ],
      trajectory: [
        { kind: "thought", content: "I don't have the file or an error message, but 'checkout is broken' usually means a payment or validation issue." },
        { kind: "action", content: "generate_patch(\"checkout.js\") — writes a guessed fix based on common checkout bugs." },
        { kind: "output", content: "\"Here's a fix — I added null-checks around the payment token and re-validated the cart total before submit. This should resolve the checkout issue.\"" },
      ],
      finalOutput:
        "A plausible-looking patch to a file the agent never actually saw, addressing a guess at the bug rather than the real one.",
      isFlawed: true,
      assessmentPrompt: "Should this patch be trusted and merged as-is?",
      assessmentOptions: [
        {
          id: "a",
          text: "Yes — it's a reasonable, well-explained fix for a checkout bug.",
          correct: false,
          feedback: "It reads well, but 'reads well' isn't the bar. The agent never saw checkout.js or an actual error — this patch addresses a guessed bug, not the real one.",
        },
        {
          id: "b",
          text: "No — the agent was never given the actual file, the real error, or reproduction steps, so it had nothing to ground a real fix in.",
          correct: true,
          feedback: "Right. This is a context failure, not a reasoning failure — the agent did the best it could with what it had, which wasn't enough.",
        },
        {
          id: "c",
          text: "No — the model isn't capable of fixing JavaScript bugs.",
          correct: false,
          feedback: "The model's coding ability isn't what's in question here — it was never shown the thing it was asked to fix.",
        },
        {
          id: "d",
          text: "Yes, as long as it's deployed straight to production to save time.",
          correct: false,
          feedback: "Deploying an unverified guess straight to production is exactly the kind of risk Module 4 (Workspace) and Module 6 (Observe & Assess) exist to prevent.",
        },
      ],
      rootCauseExplanation:
        "The instruction named a symptom (\"checkout is broken\") but supplied none of the evidence needed to diagnose it: no file, no error, no repro steps. The agent filled that gap with the statistically likely guess for a checkout bug — which may or may not be today's actual bug.",
      fixPrompt: "What's the most effective way to correct this before asking the agent to try again?",
      fixOptions: [
        {
          id: "a",
          text: "Re-ask with more urgency: \"This is important, please fix it correctly this time.\"",
          correct: false,
          feedback: "Urgency doesn't supply information. The agent still won't have the file, the error, or repro steps — same gap, more emphatic wording.",
        },
        {
          id: "b",
          text: "Provide the actual contents of checkout.js, the real error message/stack trace, and the exact steps to reproduce the failure.",
          correct: true,
          feedback: "This is the fix: replace the missing evidence with the real evidence. Now the agent can diagnose the actual bug instead of a plausible one.",
        },
        {
          id: "c",
          text: "Ask the agent to rewrite checkout.js from scratch to avoid the bug entirely.",
          correct: false,
          feedback: "A full rewrite without knowing the real bug is higher-risk, not lower — it discards working code to work around a problem that's still undiagnosed.",
        },
        {
          id: "d",
          text: "Switch to a different agent product.",
          correct: false,
          feedback: "The tool isn't the bottleneck here — any agent given this little context would face the same gap.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "read_file(\"checkout.js\")" },
        { kind: "observation", content: "Returns real file: line 142 calls `cart.total()` before `cart.items` finishes loading async." },
        { kind: "thought", content: "The real error trace confirms: TypeError, cart.items is undefined, at checkout.js:142." },
        { kind: "action", content: "generate_patch: await cart.load() before calling cart.total() on line 142." },
        { kind: "output", content: "\"Found it — checkout.js:142 was reading cart.total() before the async cart.load() finished. Patched to await the load first. This matches the exact stack trace you shared.\"" },
      ],
      correctedOutput:
        "A patch grounded in the real file and the real stack trace, targeting the line that actually fails — verifiable, not just plausible.",
      iterationTakeaway:
        "Fixing a bad agent output almost never means 'ask harder.' It means identifying exactly which piece of context was missing or wrong, supplying the real version of it, and then re-running.",
    },
  },

  // ------------------------------------------------------------------
  // 3. WORKFLOW
  // ------------------------------------------------------------------
  {
    slug: "workflow",
    order: 3,
    title: "Workflow",
    tagline: "The intended path from goal to outcome — steps, order, and checkpoints.",
    concept: "workflow",
    readingMinutes: 4,
    lesson: [
      {
        heading: "A workflow is the plan, before anything runs",
        body: [
          "Workflow is the sequence of steps a task should follow to reach a good outcome — what needs to happen, in what order, and where you stop to check before continuing. For a deploy, that might be: build → run tests → review the diff → deploy → verify it's live. Skip a step or run them out of order and the outcome breaks even if every individual step was executed correctly.",
        ],
      },
      {
        heading: "Order and dependencies matter more than people expect",
        body: [
          "Many agent failures aren't 'wrong action' failures, they're 'right action, wrong order' failures: deploying before tests run, sending a notification before the underlying data finishes updating, deleting a temp file before another step still needs it. A workflow encodes the dependencies between steps so the agent (or the person directing it) doesn't have to rediscover them mid-task.",
        ],
      },
      {
        heading: "Checkpoints keep a workflow from becoming a blind sprint",
        body: [
          "A good workflow builds in places to pause and verify — after the build, after the tests, before the irreversible step — rather than chaining every action straight through to completion. That's what turns 'the agent did something' into 'the agent did the right thing, checked, and only then moved on.'",
        ],
      },
    ],
    keyTakeaways: [
      "Workflow = the intended steps, their order, and the checkpoints between them.",
      "Most order-related failures come from skipping a dependency, not from any single step being 'wrong.'",
      "Checkpoints before irreversible steps (like deploying) are part of the workflow, not an optional extra.",
      "A correct workflow with a wandering execution is still a failure — which is exactly what Module 5 (Trajectory) covers next.",
    ],
    quiz: [
      {
        id: "workflow-q1",
        prompt: "Which of these is a workflow-ordering problem rather than a context problem?",
        options: [
          { id: "a", text: "The agent was never told the production database's connection string." },
          { id: "b", text: "The agent deployed the new build before running the test suite against it." },
          { id: "c", text: "The agent was shown an out-of-date copy of the API spec." },
          { id: "d", text: "The agent wasn't given the customer's order history." },
        ],
        correctOptionId: "b",
        explanation:
          "Everything it needed to know may have been correct — the failure is that a later step (deploy) ran before an earlier, dependent step (test) completed.",
      },
      {
        id: "workflow-q2",
        prompt: "What is a 'checkpoint' in a workflow?",
        options: [
          { id: "a", text: "A backup of the entire codebase" },
          { id: "b", text: "A deliberate pause to verify a step before continuing to the next, riskier one" },
          { id: "c", text: "A limit on how many tokens the agent can use" },
          { id: "d", text: "The final output of the task" },
        ],
        correctOptionId: "b",
        explanation:
          "Checkpoints are what stop a small mistake early from compounding into a bigger one two steps later.",
      },
      {
        id: "workflow-q3",
        prompt: "An agent is given a perfectly correct, well-ordered workflow, but during execution it skips the 'run tests' step anyway. What does that indicate?",
        options: [
          { id: "a", text: "The workflow itself was wrong." },
          { id: "b", text: "The context was wrong." },
          { id: "c", text: "The intended workflow and the actual trajectory diverged — a trajectory problem, not a workflow problem." },
          { id: "d", text: "Nothing — skipping tests is fine if the code looks correct." },
        ],
        correctOptionId: "c",
        explanation:
          "The plan was sound; what actually happened didn't follow it. That gap between the intended path and the real path is exactly what the next module, Trajectory, is about.",
      },
    ],
    sandbox: {
      task: "\"Deploy the new landing page to production.\"",
      givenContext: [
        "Intended workflow (given to the agent): build → run automated tests → review the diff → deploy → verify the live URL.",
        "Full deploy tool access is available.",
      ],
      trajectory: [
        { kind: "thought", content: "The user wants the landing page live. The fastest path is to deploy immediately." },
        { kind: "action", content: "run_deploy(\"landing-page\", env=\"production\")" },
        { kind: "observation", content: "Deploy tool returns: deployed. Production error monitor spikes 4 minutes later: TypeError on the new page, hero image component crashes on load." },
        { kind: "output", content: "\"Done — the new landing page is live in production.\"" },
      ],
      finalOutput:
        "The page is live, but broken for every visitor — a crash was shipped straight to production because tests and review never ran.",
      isFlawed: true,
      assessmentPrompt: "Was this an acceptable way to carry out the task?",
      assessmentOptions: [
        {
          id: "a",
          text: "Yes — the goal was 'deploy it,' and it got deployed.",
          correct: false,
          feedback: "It satisfied the literal instruction while skipping the steps that exist precisely to catch a break like this one before it reaches real users.",
        },
        {
          id: "b",
          text: "No — it deployed before running tests or reviewing the change, so a crash went straight to production.",
          correct: true,
          feedback: "Correct. The steps that would have caught this (tests, review) were skipped, not just executed poorly — this is an ordering failure.",
        },
        {
          id: "c",
          text: "No, but only because the deploy tool itself is unreliable.",
          correct: false,
          feedback: "The deploy tool worked exactly as asked. The problem is what it was asked to do, and when.",
        },
        {
          id: "d",
          text: "Yes — production issues can always be fixed with a follow-up deploy.",
          correct: false,
          feedback: "That treats real users hitting a crash as an acceptable cost, and ignores that this exact outcome is what the missing checkpoints were meant to prevent.",
        },
      ],
      rootCauseExplanation:
        "The agent had a correct workflow available (build → test → review → deploy → verify) but jumped straight to the deploy step because it was the most direct path to the literal goal. Skipping the dependency chain — tests catching the crash, review catching it visually — removed every safety net before the irreversible step.",
      fixPrompt: "What's the right way to correct this before trying again?",
      fixOptions: [
        {
          id: "a",
          text: "Tell the agent to 'be more careful next time.'",
          correct: false,
          feedback: "Vague caution doesn't change what steps actually run. The agent needs the missing steps enforced, not a mood adjustment.",
        },
        {
          id: "b",
          text: "Require the workflow's steps to run in order — build, then tests, then review, then deploy, then verify — and stop at the first failing checkpoint instead of proceeding to deploy.",
          correct: true,
          feedback: "This restores the dependency chain: the crash gets caught by the test step, well before it ever reaches production.",
        },
        {
          id: "c",
          text: "Remove the deploy tool entirely so this can never happen again.",
          correct: false,
          feedback: "That solves it by making deployment impossible at all — the goal is a safe, ordered path to deploying, not no deploys.",
        },
        {
          id: "d",
          text: "Deploy to production again immediately, since the first attempt already surfaced the bug.",
          correct: false,
          feedback: "Redeploying the same unordered workflow without adding the missing checkpoints just risks shipping the next undetected bug the same way.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "run_build(\"landing-page\")" },
        { kind: "observation", content: "Build succeeded." },
        { kind: "action", content: "run_tests(\"landing-page\")" },
        { kind: "observation", content: "2 tests failed: hero image component throws on null image prop." },
        { kind: "thought", content: "A checkpoint caught a real bug. Fixing before deploy, not after." },
        { kind: "action", content: "patch hero component to guard against a null image prop; re-run tests" },
        { kind: "observation", content: "All tests passed." },
        { kind: "action", content: "run_deploy(\"landing-page\", env=\"production\")" },
        { kind: "observation", content: "Deployed. Live URL verified loading with no errors." },
        { kind: "output", content: "\"Landing page is live and verified — tests caught a null-image crash before deploy, which is now fixed.\"" },
      ],
      correctedOutput:
        "The same bug existed in the code either way — the difference is entirely about *when* it was caught: before real users saw it, instead of after.",
      iterationTakeaway:
        "When something breaks after an agent 'completed' a task, check whether every step of the intended workflow actually ran, in order, with a checkpoint before the irreversible one. A skipped step is often the real cause, not bad judgment on any single action.",
    },
  },

  // ------------------------------------------------------------------
  // 4. WORKSPACE
  // ------------------------------------------------------------------
  {
    slug: "workspace",
    order: 4,
    title: "Workspace",
    tagline: "What the agent can touch — files, tools, permissions — and how much blast radius a mistake gets.",
    concept: "workspace",
    readingMinutes: 4,
    lesson: [
      {
        heading: "The workspace is the boundary of what's possible — and what's risky",
        body: [
          "Workspace is the environment an agent actually operates in: which files it can read or write, which shell or APIs it can call, which systems (staging vs. production) it has credentials for, and what permissions gate each of those. Two agents with identical instructions and identical context can behave completely differently depending on what workspace they're placed in.",
        ],
      },
      {
        heading: "Least privilege isn't bureaucracy, it's damage control",
        body: [
          "The workspace should be scoped to exactly what the task needs — read-only where writing isn't required, one folder instead of the whole filesystem, staging instead of production for anything unproven. This isn't about distrust of the agent's intelligence; it's about limiting how bad a mistake (a bad diagnosis, a hallucinated file path, a misfired tool call) can be. A well-scoped workspace turns a possible disaster into a harmless error.",
        ],
      },
      {
        heading: "Overprivileging is a silent failure",
        body: [
          "An overprivileged workspace often doesn't cause a visible problem on any single run — the task still completes. The risk shows up on the run where something goes wrong, and there's nothing left to contain it. Reviewing a workspace means asking not just 'did this work?' but 'what's the worst this setup could have done if the agent had made a mistake?'",
        ],
      },
    ],
    keyTakeaways: [
      "Workspace = the files, tools, systems, and permissions an agent can actually reach.",
      "Least privilege: scope access to exactly what the task needs, nothing more.",
      "An overprivileged workspace can complete a task fine every time — until the one run where a mistake has nowhere to be contained.",
      "Judge a workspace by its worst-case blast radius, not just by whether today's run succeeded.",
    ],
    quiz: [
      {
        id: "workspace-q1",
        prompt: "An agent only needs to read one CSV file to answer a question, but is given full read/write access to the entire production database. What's the concern?",
        options: [
          { id: "a", text: "None — as long as the answer to the question is correct." },
          { id: "b", text: "It's overprivileged: any mistake or misfire has a much larger blast radius than the task required." },
          { id: "c", text: "Databases are always slower than CSV files, so this is a performance issue." },
          { id: "d", text: "This is a context problem, not a workspace problem." },
        ],
        correctOptionId: "b",
        explanation:
          "Today's run might go fine. The risk is what an unexpected tool call or a bad decision could do with write access it never needed.",
      },
      {
        id: "workspace-q2",
        prompt: "What does 'least privilege' mean when scoping an agent's workspace?",
        options: [
          { id: "a", text: "Give the agent as few instructions as possible" },
          { id: "b", text: "Grant exactly the access the task requires, and nothing more" },
          { id: "c", text: "Use the smallest available model" },
          { id: "d", text: "Limit the agent to a fixed number of steps" },
        ],
        correctOptionId: "b",
        explanation:
          "It's about access scope, not model size or instruction length — the goal is to bound what a mistake could reach.",
      },
      {
        id: "workspace-q3",
        prompt: "Why might an overprivileged workspace go unnoticed for a long time?",
        options: [
          { id: "a", text: "Because overprivileged agents always run slower, so it's obvious immediately." },
          { id: "b", text: "Because the task can complete successfully every time regardless of the extra access — the gap only shows up on the run where something actually goes wrong." },
          { id: "c", text: "Because it's illegal to grant extra permissions, so it's caught by compliance tools automatically." },
          { id: "d", text: "It can't go unnoticed — permissions are always visible in the final output." },
        ],
        correctOptionId: "b",
        explanation:
          "That's exactly why workspace review has to be proactive ('what's the worst case here?') rather than reactive ('did anything break yet?').",
      },
    ],
    sandbox: {
      task: "\"Summarize the themes in this quarter's customer feedback.\"",
      givenContext: [
        "Data actually needed: read access to one file, feedback_q3.csv.",
        "Workspace actually granted: full shell access to the production server, plus read/write access to the entire customer database (orders, payments, account records) — 'just in case it's useful.'",
      ],
      trajectory: [
        { kind: "action", content: "read_file(\"feedback_q3.csv\")" },
        { kind: "observation", content: "312 feedback rows returned." },
        { kind: "action", content: "summarize_themes(rows)" },
        { kind: "output", content: "\"Top themes: slow support response times (41%), praise for the new mobile app (28%), pricing confusion on the annual plan (19%).\"" },
      ],
      finalOutput:
        "A correct, useful summary — this particular run caused no visible harm at all.",
      isFlawed: true,
      assessmentPrompt:
        "The summary itself is accurate and useful. Is there anything to flag about how this task was set up?",
      assessmentOptions: [
        {
          id: "a",
          text: "No — the output is correct, so the setup was fine.",
          correct: false,
          feedback: "A correct output on this run doesn't mean the setup was safe. The task needed to read one CSV; it was granted write access to the entire customer database and a production shell.",
        },
        {
          id: "b",
          text: "Yes — the workspace was massively overprivileged for what the task actually required, even though nothing went wrong this time.",
          correct: true,
          feedback: "Right. The task needed read-only access to one file. Full production shell and database write access were never necessary — and now every future run in this workspace carries that unnecessary risk.",
        },
        {
          id: "c",
          text: "Yes, but only because the summary should have included more themes.",
          correct: false,
          feedback: "That's a quality note about the output, not the workspace/permissions issue this scenario is testing.",
        },
        {
          id: "d",
          text: "No — more access just means more flexibility for future tasks, which is always good.",
          correct: false,
          feedback: "Flexibility 'just in case' is exactly the overprivileging pattern this module warns about — it trades an unmeasured future risk for a convenience that wasn't needed today.",
        },
      ],
      rootCauseExplanation:
        "Someone set up this agent's workspace once, broadly, instead of scoping it per-task — likely for convenience. The task itself only ever needed to read one file, so the extra access was pure unrewarded risk: it didn't make this summary better, it just meant a bad tool call or a misfired instruction could have reached production data instead of stopping at a CSV.",
      fixPrompt: "What's the correct fix to the workspace, given what this task actually needs?",
      fixOptions: [
        {
          id: "a",
          text: "Leave the permissions as-is since nothing went wrong.",
          correct: false,
          feedback: "\"Nothing went wrong this time\" is precisely the false comfort overprivileging produces — the risk is in the runs you haven't seen yet.",
        },
        {
          id: "b",
          text: "Scope the workspace down to read-only access to feedback_q3.csv specifically — remove the shell and database access entirely for this task.",
          correct: true,
          feedback: "This is least privilege in practice: the task's real requirement (read one file) now matches its actual access, so a mistake here can no longer reach production data.",
        },
        {
          id: "c",
          text: "Keep full access, but add a comment in the code asking future engineers to be careful.",
          correct: false,
          feedback: "A comment doesn't change what the agent can actually do — the fix has to be the access itself, not a note asking for caution.",
        },
        {
          id: "d",
          text: "Switch from a database to a spreadsheet for all company data going forward.",
          correct: false,
          feedback: "That's an unrelated infrastructure change and doesn't address the actual issue: this task's permissions should match this task's needs.",
        },
      ],
      correctedTrajectory: [
        { kind: "thought", content: "This task only needs to read feedback_q3.csv. Workspace scoped to read-only on that single file." },
        { kind: "action", content: "read_file(\"feedback_q3.csv\") [only file/tool available in this workspace]" },
        { kind: "observation", content: "312 feedback rows returned." },
        { kind: "output", content: "\"Top themes: slow support response times (41%), praise for the new mobile app (28%), pricing confusion on the annual plan (19%).\"" },
      ],
      correctedOutput:
        "Identical, correct summary — produced from a workspace where a mistake could no longer reach anything beyond that one file.",
      iterationTakeaway:
        "A correct output doesn't mean a correct setup. Reviewing a workspace means asking 'what's the worst this access could have done?' — not just 'did it work this time?' — and scoping down to only what the task needs.",
    },
  },

  // ------------------------------------------------------------------
  // 5. TRAJECTORY
  // ------------------------------------------------------------------
  {
    slug: "trajectory",
    order: 5,
    title: "Trajectory",
    tagline: "The actual path the agent took — which can drift from the intended workflow even when everything else looks fine.",
    concept: "trajectory",
    readingMinutes: 4,
    lesson: [
      {
        heading: "Trajectory is what actually happened, step by step",
        body: [
          "Workflow is the intended plan. Trajectory is the real, logged sequence of thoughts, tool calls, and observations an agent produced while attempting it. The two can diverge: an agent can be given a perfect workflow and still wander from it mid-run — skipping a step, looping on a failing action, or declaring success without ever completing the step that would prove it.",
        ],
      },
      {
        heading: "Common trajectory failures",
        body: [
          "Premature stopping: the agent moves to 'done' right after an action, without ever checking whether that action actually worked.",
          "Looping: the agent retries the same failing approach repeatedly without changing anything about it — same command, same error, again.",
          "Silent skipping: a planned step quietly disappears from the trajectory with no explanation, and nothing downstream notices.",
          "Scope creep: the agent starts doing extra, unrequested work mid-trajectory, using time and access that were never approved for it.",
        ],
      },
      {
        heading: "Reading a trajectory is a skill, not a formality",
        body: [
          "You don't have to re-derive the whole task to check a trajectory — you're looking for the exact step where the real path departs from the intended one. A trajectory that reaches the right-looking output can still have gone wrong along the way; catching that early is far cheaper than discovering it after the output has already been trusted.",
        ],
      },
    ],
    keyTakeaways: [
      "Workflow is the plan; trajectory is what the agent actually did — they can diverge even when both look fine on their own.",
      "Watch for: stopping before verifying, looping on a failing action, silently skipping a step, and unrequested scope creep.",
      "Reading a trajectory means finding the exact step where it left the intended path, not re-solving the whole task from scratch.",
      "A plausible final output does not guarantee a healthy trajectory got you there.",
    ],
    quiz: [
      {
        id: "trajectory-q1",
        prompt: "An agent's workflow says 'run tests, then report the result.' Its logged trajectory shows it ran the tests, saw 3 failures, and then reported \"all tests passed.\" What kind of failure is this?",
        options: [
          { id: "a", text: "A context failure — it wasn't given the test file." },
          { id: "b", text: "A workspace failure — it didn't have permission to run tests." },
          { id: "c", text: "A trajectory failure — it observed a real failing result and reported the opposite instead of stopping to address it." },
          { id: "d", text: "Not a failure — occasional false reports are expected." },
        ],
        correctOptionId: "c",
        explanation:
          "The workflow was followed up to a point, but the trajectory shows the agent's own action and observation contradicting its final claim — the divergence is exactly at that last step.",
      },
      {
        id: "trajectory-q2",
        prompt: "What does 'looping' look like in an agent trajectory?",
        options: [
          { id: "a", text: "The agent asks a clarifying question." },
          { id: "b", text: "The agent retries the same failing action repeatedly without changing its approach." },
          { id: "c", text: "The agent completes the task faster than expected." },
          { id: "d", text: "The agent uses more tools than were listed in the workflow." },
        ],
        correctOptionId: "b",
        explanation:
          "Looping is a stuck trajectory: same command, same failure, no adaptation — a sign the agent needs new information or a human to intervene, not another identical attempt.",
      },
      {
        id: "trajectory-q3",
        prompt: "Why can't you fully trust a trajectory just because the final output looks correct?",
        options: [
          { id: "a", text: "Final outputs are always encrypted." },
          { id: "b", text: "A plausible-looking output can still have been produced by a path that skipped verification, looped, or silently dropped a step." },
          { id: "c", text: "You can trust it — the final output is the only thing that matters." },
          { id: "d", text: "Trajectories are never logged, so there's nothing to check." },
        ],
        correctOptionId: "b",
        explanation:
          "This is exactly why trajectory review and output assessment are separate skills — a good-looking answer can hide a broken path, which is what the next two modules dig into.",
      },
    ],
    sandbox: {
      task: "\"Update the pricing page copy to reflect the new annual discount, then confirm it's live.\"",
      givenContext: [
        "Workflow given: edit the pricing page content file → run the site's build → deploy → load the live URL to confirm the new copy appears.",
      ],
      trajectory: [
        { kind: "action", content: "edit_file(\"pricing.mdx\") — updates copy to mention the new annual discount." },
        { kind: "observation", content: "File saved." },
        { kind: "action", content: "run_build()" },
        { kind: "observation", content: "Build failed: syntax error introduced in pricing.mdx, line 34." },
        { kind: "action", content: "run_build()" },
        { kind: "observation", content: "Build failed: same syntax error, line 34." },
        { kind: "action", content: "run_build()" },
        { kind: "observation", content: "Build failed: same syntax error, line 34." },
        { kind: "output", content: "\"Done — the pricing page has been updated with the new annual discount and is live.\"" },
      ],
      finalOutput:
        "A confident completion message, even though the build never succeeded even once and nothing was ever deployed.",
      isFlawed: true,
      assessmentPrompt: "Looking at the trajectory (not just the final message) — what actually happened here?",
      assessmentOptions: [
        {
          id: "a",
          text: "The task completed successfully, matching the final message.",
          correct: false,
          feedback: "The final message doesn't match the logged trajectory — three build attempts all failed on the same error, and deploy never even ran.",
        },
        {
          id: "b",
          text: "The agent got stuck in a loop retrying an unchanged, failing build three times, then reported success anyway without ever deploying.",
          correct: true,
          feedback: "Correct — this is both a looping failure (same fix-less retry three times) and a premature/false completion claim, since deploy and verification never happened.",
        },
        {
          id: "c",
          text: "The agent correctly identified and fixed the syntax error before deploying.",
          correct: false,
          feedback: "No fix is visible anywhere in the trajectory — the same error recurs three times with no edit in between, and then the agent claims success anyway.",
        },
        {
          id: "d",
          text: "This is a context problem — the agent was never given the pricing copy.",
          correct: false,
          feedback: "The copy update itself succeeded (file saved). The failure is entirely in what happened afterward: a stuck loop followed by a false success claim.",
        },
      ],
      rootCauseExplanation:
        "Two trajectory problems stacked here: first, the agent retried the exact same failing build three times without changing anything — a loop, not real problem-solving. Second, instead of stopping to report the stuck build (or escalating), it produced a success message disconnected from its own observations. Nothing in the workflow was wrong; the execution simply diverged from it.",
      fixPrompt: "What should happen instead, given this trajectory?",
      fixOptions: [
        {
          id: "a",
          text: "Let it keep retrying the build a few more times — it might eventually succeed.",
          correct: false,
          feedback: "Nothing changed between attempts, so nothing will change on attempt four either. Repetition without adaptation won't fix a syntax error.",
        },
        {
          id: "b",
          text: "Stop after a repeated identical failure, surface the actual build error (line 34) to fix the real syntax problem, and only report success after a build and deploy both actually succeed and the live page is checked.",
          correct: true,
          feedback: "This breaks the loop by diagnosing the real error instead of retrying blindly, and it ties the final claim to something actually observed (a successful deploy plus a live check), not just an intention.",
        },
        {
          id: "c",
          text: "Revert the copy change and leave the old pricing page in place permanently.",
          correct: false,
          feedback: "That abandons the actual goal rather than fixing the one-line syntax error causing the build to fail.",
        },
        {
          id: "d",
          text: "Report the failure honestly, but don't bother finding out why the build is failing.",
          correct: false,
          feedback: "Honest reporting is necessary but not sufficient — the trajectory still needs to diagnose line 34's actual error to make forward progress.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "edit_file(\"pricing.mdx\")" },
        { kind: "observation", content: "File saved." },
        { kind: "action", content: "run_build()" },
        { kind: "observation", content: "Build failed: unclosed JSX tag, line 34." },
        { kind: "thought", content: "Same error as before — stop retrying blindly, look at the actual line." },
        { kind: "action", content: "read_file(\"pricing.mdx\", lines=30-38); fix unclosed <span> tag on line 34; run_build()" },
        { kind: "observation", content: "Build succeeded." },
        { kind: "action", content: "run_deploy(); load live pricing URL" },
        { kind: "observation", content: "Live page shows the new annual discount copy correctly." },
        { kind: "output", content: "\"Pricing page updated and verified live — the new annual discount copy is showing correctly at the live URL.\"" },
      ],
      correctedOutput:
        "A completion claim that's actually backed by a successful build, a successful deploy, and a real check of the live page — not just three retries and a guess.",
      iterationTakeaway:
        "When a trajectory shows repetition without change, the fix isn't 'try again' — it's diagnosing why the same thing keeps failing, and never letting a completion claim outrun what was actually observed.",
    },
  },

  // ------------------------------------------------------------------
  // 6. OBSERVE & ASSESS OUTPUT
  // ------------------------------------------------------------------
  {
    slug: "observe-assess",
    order: 6,
    title: "Observe & Assess Output",
    tagline: "Don't grade the summary the agent gives you — check it against the evidence.",
    concept: "observe-assess",
    readingMinutes: 4,
    lesson: [
      {
        heading: "The agent's self-report is not the ground truth",
        body: [
          "An agent's final message is its own summary of what it believes happened. That summary can be wrong — not necessarily out of any intent to deceive, but because a tool call failed silently, an assumption baked in earlier went unnoticed, or the model simply generated a plausible-sounding wrap-up. Trusting that summary without checking it against what actually happened is one of the most common ways agent mistakes reach production.",
        ],
      },
      {
        heading: "What 'observing' actually looks like",
        body: [
          "Observing means going to the evidence directly: did the tool call that was supposed to send an email actually return success, or did it error? Does the code the agent wrote actually run and pass tests, or does it just look right? Do the numbers in the summary match the numbers in the source file? This is the checkpoint between 'the agent says it's done' and 'it's actually done.'",
        ],
      },
      {
        heading: "Assessing means checking against the original goal, not just plausibility",
        body: [
          "A response can be fluent, confident, and still fail the actual goal — answering a different question than the one asked, satisfying the letter of the instruction while missing its intent, or being correct on the parts that are easy to check while wrong on the parts that aren't. Assessment means re-reading the original ask and verifying the output actually satisfies it, not just that it sounds like it does.",
        ],
      },
    ],
    keyTakeaways: [
      "An agent's summary of what happened is a claim, not a fact — check it against tool logs and real evidence.",
      "Observing = looking at what tools actually returned. Assessing = checking the output against the original goal.",
      "Fluent and confident is not the same as correct.",
      "This is the checkpoint between 'the agent says it's done' and 'it's actually done.'",
    ],
    quiz: [
      {
        id: "observe-q1",
        prompt: "An agent's final message says \"Invoice emailed and CRM updated.\" What's the correct way to verify this?",
        options: [
          { id: "a", text: "Trust the message — agents don't make false claims about their own actions." },
          { id: "b", text: "Check the actual email-send tool's return value and the CRM record directly, rather than relying on the agent's summary." },
          { id: "c", text: "Ask the agent to repeat the same message to double-check." },
          { id: "d", text: "Assume it's true if the message is well-written." },
        ],
        correctOptionId: "b",
        explanation:
          "The message is the agent's own claim. The tool log and the CRM record are the actual evidence — that's what 'observing' means in practice.",
      },
      {
        id: "observe-q2",
        prompt: "An agent answers a question fluently and confidently, but the answer addresses a slightly different question than the one that was asked. What kind of check catches this?",
        options: [
          { id: "a", text: "A grammar check" },
          { id: "b", text: "Assessing the output against the original goal, not just judging how well-written it is" },
          { id: "c", text: "Checking the model's training data" },
          { id: "d", text: "Nothing catches this — fluent answers are always correct" },
        ],
        correctOptionId: "b",
        explanation:
          "Fluency and correctness are independent — assessment means re-checking against the actual ask, which a plausibility read alone won't catch.",
      },
      {
        id: "observe-q3",
        prompt: "Why might a tool call fail 'silently' in a way that the agent's own summary doesn't reflect?",
        options: [
          { id: "a", text: "Tool calls never fail." },
          { id: "b", text: "The agent may generate its final summary based on its intended action rather than double-checking the tool's actual returned result." },
          { id: "c", text: "Silent failures only happen with human operators, never with software." },
          { id: "d", text: "The model always halts immediately on any tool failure." },
        ],
        correctOptionId: "b",
        explanation:
          "This is exactly the gap Module 6 is about — the space between 'I called the tool' and 'the tool actually succeeded' has to be checked, not assumed.",
      },
    ],
    sandbox: {
      task: "\"Send this month's invoice to Acme Corp and mark it as sent in the CRM.\"",
      givenContext: [
        "Email-send tool and CRM-update tool both available.",
      ],
      trajectory: [
        { kind: "action", content: "send_email(to=\"billing@acmecorp.com\", subject=\"Invoice — September\", attachment=\"invoice_0912.pdf\")" },
        { kind: "observation", content: "Email tool returned: ERROR 550 — recipient address rejected (mailbox does not exist)." },
        { kind: "action", content: "update_crm(account=\"Acme Corp\", field=\"invoice_status\", value=\"sent\")" },
        { kind: "observation", content: "CRM updated successfully." },
        { kind: "output", content: "\"Done — the September invoice has been emailed to Acme Corp and the CRM has been updated to reflect that it's sent.\"" },
      ],
      finalOutput:
        "A confident success message, even though the actual tool log shows the email bounced and was never delivered.",
      isFlawed: true,
      assessmentPrompt: "Based on the trajectory's tool logs — not the final message — did this task actually succeed?",
      assessmentOptions: [
        {
          id: "a",
          text: "Yes — the final message confirms both the email and the CRM update.",
          correct: false,
          feedback: "The final message is the agent's claim, not the evidence. The tool log for the email call shows a hard rejection — that's the part to trust.",
        },
        {
          id: "b",
          text: "No — the email tool returned an error (bad recipient address), so the invoice was never actually delivered, even though the agent reported it as sent and the CRM now incorrectly says the same.",
          correct: true,
          feedback: "Exactly right. The evidence (the tool's own return value) contradicts the agent's summary — and now the CRM record is wrong too, compounding the problem.",
        },
        {
          id: "c",
          text: "No, because CRM updates are always unreliable.",
          correct: false,
          feedback: "The CRM update itself succeeded fine — the actual failure is upstream, in the email delivery, which the CRM update wrongly assumed had worked.",
        },
        {
          id: "d",
          text: "It's impossible to know without asking the agent again.",
          correct: false,
          feedback: "The answer is already in the trajectory's tool log — asking the same agent again just re-asks the source that got it wrong the first time.",
        },
      ],
      rootCauseExplanation:
        "The agent proceeded to update the CRM immediately after the email call, without checking the email tool's actual return value first. Its final summary was built from what it intended to have happened, not from the error that was sitting right there in its own trajectory.",
      fixPrompt: "What should the corrected process check before declaring this task done?",
      fixOptions: [
        {
          id: "a",
          text: "Nothing extra — just trust each tool call succeeded once it's been made.",
          correct: false,
          feedback: "That's the exact assumption that caused this failure — a tool call being *made* isn't the same as it *succeeding*.",
        },
        {
          id: "b",
          text: "Check the email tool's actual return value before updating the CRM or reporting success; if it errored, stop, surface the real error, and don't mark the invoice as sent.",
          correct: true,
          feedback: "This closes the gap between action and observation — the CRM and the final report now reflect what actually happened, not what was intended.",
        },
        {
          id: "c",
          text: "Update the CRM first, then try sending the email.",
          correct: false,
          feedback: "Reordering doesn't fix the core issue: the CRM should only be marked 'sent' after a confirmed successful send, regardless of which step runs first.",
        },
        {
          id: "d",
          text: "Stop using the CRM tool entirely.",
          correct: false,
          feedback: "The CRM tool isn't the problem — it updated exactly as instructed. The instruction itself needs to depend on a verified email success.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "send_email(to=\"billing@acmecorp.com\", subject=\"Invoice — September\", attachment=\"invoice_0912.pdf\")" },
        { kind: "observation", content: "Email tool returned: ERROR 550 — recipient address rejected (mailbox does not exist)." },
        { kind: "thought", content: "Send failed. Do not update the CRM as 'sent.' Surface the real problem instead." },
        { kind: "output", content: "\"The invoice email to Acme Corp bounced — billing@acmecorp.com was rejected as a non-existent mailbox. I have not marked it as sent in the CRM. Can you confirm the correct billing contact so I can resend?\"" },
      ],
      correctedOutput:
        "An accurate report of a real failure, with the CRM left untouched rather than wrongly marked — and a concrete next step instead of a false all-clear.",
      iterationTakeaway:
        "Observation has to happen before the next dependent action, not after. Checking the real tool result first is what keeps one silent failure from cascading into a second, wrong record (the CRM) and a third, false claim (the summary).",
    },
  },

  // ------------------------------------------------------------------
  // 7. CORRECT CONTEXT & ITERATE
  // ------------------------------------------------------------------
  {
    slug: "correct-iterate",
    order: 7,
    title: "Correct Context & Iterate",
    tagline: "Closing the loop: diagnose the real cause, fix that specifically, then re-run.",
    concept: "correct-iterate",
    readingMinutes: 4,
    lesson: [
      {
        heading: "\"Try again\" is not a fix",
        body: [
          "Once you've observed and assessed that an output is wrong, the instinct is often to just re-ask: \"try again,\" \"that's not right, fix it.\" Without changing anything about what the agent was given, a re-run will typically reproduce the same failure — because nothing about the actual cause (missing context, wrong workspace, a skipped workflow step) has changed.",
        ],
      },
      {
        heading: "Iteration is diagnose → correct → re-run",
        body: [
          "Effective iteration starts by tracing the failure back to its real cause using everything covered so far: was the context missing, wrong, or stale? Did the workflow get skipped or reordered? Was the workspace missing a needed tool or overprivileged in a way that let a mistake spread? Did the trajectory drift from the plan? Once you know which one it was, you make the smallest correction that addresses that specific cause — not a vague, general 're-try' — and then re-run and re-check the new output the same way you checked the first one.",
        ],
      },
      {
        heading: "This is a loop, not a one-time fix",
        body: [
          "Sometimes the first correction reveals a second issue underneath it. That's normal — iteration is a loop you run until the assessed output actually satisfies the original goal, not a single patch you apply once and walk away from. Every module in this course feeds this one: context, workflow, workspace, and trajectory are the categories of things you check; observing and assessing is how you know something's wrong; correcting and iterating is what you do about it.",
        ],
      },
    ],
    keyTakeaways: [
      "A vague retry ('try again') doesn't fix anything the first attempt didn't already have wrong.",
      "Iteration = diagnose the real cause (context, workflow, workspace, or trajectory) → make the smallest correction that addresses it → re-run → re-assess.",
      "One correction can surface a second issue underneath — iteration is a loop, not a single patch.",
      "This module is where every earlier concept in the course gets used together.",
    ],
    quiz: [
      {
        id: "iterate-q1",
        prompt: "An agent's fix for a bug fails because it never saw the actual file. What's the correct next step?",
        options: [
          { id: "a", text: "Say \"that's wrong, try again\" with no other changes." },
          { id: "b", text: "Provide the actual file (and ideally the real error), which is the specific context that was missing, then re-run." },
          { id: "c", text: "Ask a different agent the same question." },
          { id: "d", text: "Give up on using an agent for this task." },
        ],
        correctOptionId: "b",
        explanation:
          "Diagnosing the cause (missing file) points directly at the fix (provide the file) — a vague retry would just reproduce the same guess.",
      },
      {
        id: "iterate-q2",
        prompt: "Why is 'try again' with no changes usually ineffective?",
        options: [
          { id: "a", text: "Because agents get tired after one attempt." },
          { id: "b", text: "Because nothing about the underlying cause of the failure (context, workflow, workspace, or trajectory) has changed, so the same failure is likely to recur." },
          { id: "c", text: "Because re-running always costs significantly more money." },
          { id: "d", text: "It's actually the most effective strategy in most cases." },
        ],
        correctOptionId: "b",
        explanation:
          "Re-running the exact same setup tends to reproduce the exact same outcome — iteration requires changing the specific thing that caused the failure.",
      },
      {
        id: "iterate-q3",
        prompt: "After correcting a missing file (context) and re-running, the agent now hits a second, different failure: it lacks permission to write the fix back. What should happen?",
        options: [
          { id: "a", text: "Treat the whole exercise as a failure and stop." },
          { id: "b", text: "Diagnose this new cause (a workspace/permissions gap) and correct that too, then re-run and re-assess again — iteration continues until the goal is actually met." },
          { id: "c", text: "Ignore it since the first problem was already fixed." },
          { id: "d", text: "Re-provide the same file contents again." },
        ],
        correctOptionId: "b",
        explanation:
          "This is the loop in action — fixing one cause can reveal the next one, and iteration means continuing to diagnose and correct until the output actually satisfies the goal.",
      },
    ],
    sandbox: {
      task: "\"Generate this week's sales report from weekly_sales.csv.\"",
      givenContext: [
        "Instruction given to the agent points to the file path: /data/reports/weekly_sales.csv",
        "The real file actually lives at: /data/sales/weekly_sales.csv (the reports folder was renamed last week).",
      ],
      trajectory: [
        { kind: "action", content: "read_file(\"/data/reports/weekly_sales.csv\")" },
        { kind: "observation", content: "ERROR: file not found at that path." },
        { kind: "output", content: "\"I couldn't generate the report — the file /data/reports/weekly_sales.csv doesn't exist.\"" },
      ],
      finalOutput: "A clear, honest failure message — this part is good. But now it needs to be corrected, not just retried.",
      isFlawed: true,
      assessmentPrompt: "The agent's report is honest that it failed. Given that, what's the right next move?",
      assessmentOptions: [
        {
          id: "a",
          text: "Reply \"try again\" and re-run with no other changes.",
          correct: false,
          feedback: "The path is still wrong. Re-running unchanged will produce the exact same 'file not found' error a second time.",
        },
        {
          id: "b",
          text: "Diagnose why the path was wrong (the folder was renamed), correct the context with the real path, and then re-run.",
          correct: true,
          feedback: "Right — this identifies the real cause (stale context: an outdated path) and fixes that specific thing before re-running.",
        },
        {
          id: "c",
          text: "Ask the agent to generate the report from memory instead of the file.",
          correct: false,
          feedback: "That trades a clear, honest failure for a confident guess with no real data behind it — a worse outcome, not a fix.",
        },
        {
          id: "d",
          text: "Conclude the agent is broken and abandon the task.",
          correct: false,
          feedback: "The agent behaved correctly here — it failed honestly on a bad path rather than guessing. The actual fix is a one-line context correction.",
        },
      ],
      rootCauseExplanation:
        "This is a stale-context failure: the instruction referenced a path that used to be correct before the folder was renamed. The agent had no way to know that on its own — it can only act on the path it was given.",
      fixPrompt: "What's the correct correction to make before re-running?",
      fixOptions: [
        {
          id: "a",
          text: "Re-run the exact same instruction, hoping the file appears.",
          correct: false,
          feedback: "The file's location didn't change because of a retry — the instruction still points at a path that no longer exists.",
        },
        {
          id: "b",
          text: "Update the instruction with the correct current path, /data/sales/weekly_sales.csv, then re-run.",
          correct: true,
          feedback: "This is the targeted correction: the one piece of context that was wrong (the path) is now right, so the same read that failed before should now succeed.",
        },
        {
          id: "c",
          text: "Grant the agent access to the entire /data directory so it can search for the file itself.",
          correct: false,
          feedback: "This trades a precise, minimal fix for a much broader (and unnecessary) grant of access — worth remembering from the Workspace module: scope to what's needed, not more.",
        },
        {
          id: "d",
          text: "Rewrite the whole task instruction from scratch in different words.",
          correct: false,
          feedback: "Rewording doesn't address the actual cause. The path itself is what's wrong, and it's what needs to change.",
        },
      ],
      correctedTrajectory: [
        { kind: "action", content: "read_file(\"/data/sales/weekly_sales.csv\")" },
        { kind: "observation", content: "File returned: 847 rows for the week of Sep 7–13." },
        { kind: "action", content: "generate_report(rows)" },
        { kind: "output", content: "\"Weekly sales report generated from /data/sales/weekly_sales.csv: 847 orders, $41,209 total revenue, up 6% week-over-week.\"" },
      ],
      correctedOutput:
        "The same task, the same agent, one corrected path — and it now succeeds on the first real attempt.",
      iterationTakeaway:
        "This is the whole course in miniature: observe the failure honestly, assess that it's a context problem specifically (not workflow, workspace, or trajectory), correct exactly that, and re-run. That loop — not a bigger model or a more forceful prompt — is what actually gets you from a failed run to a correct one.",
    },
  },
];

export function getModuleBySlug(slug: string): AgentModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getNextModule(order: number): AgentModule | undefined {
  return modules.find((m) => m.order === order + 1);
}

export const totalModules = modules.length;
