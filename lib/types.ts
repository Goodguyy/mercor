// Shared content types for Agent Academy.
// Kept intentionally simple (no external schema library) since this is
// a v1 assessment build. If/when this becomes a real SaaS on Supabase,
// these same shapes can be used as the row types for a `modules` table.

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type TrajectoryStepKind = "thought" | "action" | "observation" | "output";

export type TrajectoryStep = {
  kind: TrajectoryStepKind;
  content: string;
};

export type AssessmentOption = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
};

export type FixOption = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
};

export type SandboxScenario = {
  task: string;
  givenContext: string[];
  trajectory: TrajectoryStep[];
  finalOutput: string;
  isFlawed: boolean;
  assessmentPrompt: string;
  assessmentOptions: AssessmentOption[];
  rootCauseExplanation: string;
  fixPrompt: string;
  fixOptions: FixOption[];
  correctedTrajectory: TrajectoryStep[];
  correctedOutput: string;
  iterationTakeaway: string;
};

export type LessonSection = {
  heading: string;
  body: string[];
};

export type AgentModule = {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  concept: string;
  readingMinutes: number;
  lesson: LessonSection[];
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  sandbox: SandboxScenario;
};
