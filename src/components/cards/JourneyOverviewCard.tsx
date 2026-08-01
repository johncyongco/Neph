import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import type { Person } from "@/lib/types";
import { journeyYearCount, needFollowUp, prayingFor } from "@/lib/selectors";

export function JourneyOverviewCard({ people }: { people: Person[] }) {
  const navigate = useNavigate();
  const stats = [
    { value: people.length, label: "Journey People", color: "var(--green)", to: "/people" },
    {
      value: needFollowUp(people).length,
      label: "Need Follow-up",
      color: "var(--terracotta)",
      to: "/people?filter=followup",
    },
    { value: journeyYearCount(people), label: "Years Together", color: "var(--mustard)", to: "/journey" },
    {
      value: prayingFor(people).length,
      label: "People You Pray For",
      color: "var(--lake)",
      to: "/people?filter=prayer",
    },
  ];
  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="label">Journey Overview</span>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            value={s.value}
            label={s.label}
            color={s.color}
            onClick={() => navigate(s.to)}
          />
        ))}
      </div>
      <div className="divider mt-4" />
      <p className="editorial mt-4 text-[14px]">
        A journey is not a list of people held — it is the slow noticing of who has stayed.
      </p>
    </Card>
  );
}