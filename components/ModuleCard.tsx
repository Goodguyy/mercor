import Link from "next/link";
import { AgentModule } from "@/lib/types";
import { ModuleProgress, isModuleComplete } from "@/lib/progress";

function statusFor(p: ModuleProgress | undefined) {
  if (isModuleComplete(p)) return { label: "Completed", classes: "bg-accent2/15 text-accent2" };
  if (p && (p.lessonRead || p.sandboxDone || typeof p.quizScore === "number")) {
    return { label: "In progress", classes: "bg-warn/15 text-warn" };
  }
  return { label: "Not started", classes: "bg-black/5 text-black/50" };
}

export default function ModuleCard({
  mod,
  progress,
  locked,
}: {
  mod: AgentModule;
  progress: ModuleProgress | undefined;
  locked: boolean;
}) {
  const status = statusFor(progress);
  const content = (
    <div
      className={`card flex items-start gap-4 p-5 transition ${
        locked ? "opacity-50" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
        {mod.order}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{mod.title}</h3>
          <span className={`tag ${status.classes}`}>{status.label}</span>
        </div>
        <p className="mt-1 text-sm text-black/60">{mod.tagline}</p>
        <p className="mt-2 text-xs text-black/40">
          {mod.readingMinutes} min lesson &middot; quiz &middot; agent sandbox
        </p>
      </div>
    </div>
  );

  if (locked) {
    return <div title="Finish the previous module first">{content}</div>;
  }

  return (
    <Link href={`/modules/${mod.slug}`} className="block">
      {content}
    </Link>
  );
}
