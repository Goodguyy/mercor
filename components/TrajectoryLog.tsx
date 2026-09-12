import { TrajectoryStep } from "@/lib/types";

const KIND_META: Record<
  TrajectoryStep["kind"],
  { label: string; classes: string }
> = {
  thought: { label: "THOUGHT", classes: "text-accent2" },
  action: { label: "ACTION", classes: "text-accent" },
  observation: { label: "OBSERVATION", classes: "text-warn" },
  output: { label: "OUTPUT", classes: "text-paper font-semibold" },
};

export default function TrajectoryLog({ steps }: { steps: TrajectoryStep[] }) {
  return (
    <div className="terminal space-y-2">
      {steps.map((step, i) => {
        const meta = KIND_META[step.kind];
        return (
          <div key={i} className="leading-relaxed">
            <span className={`mr-2 text-xs ${meta.classes}`}>[{meta.label}]</span>
            <span className="text-paper/90">{step.content}</span>
          </div>
        );
      })}
    </div>
  );
}
