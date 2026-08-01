import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { usePeopleStore } from "@/store/usePeopleStore";
import type { Person } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/tw";

interface ReminderCardProps {
  person: Person;
  kind: "reach" | "prayer";
  className?: string;
}

export function ReminderCard({ person, kind, className }: ReminderCardProps) {
  const navigate = useNavigate();
  const markContacted = usePeopleStore((s) => s.markContacted);
  const togglePrayFor = usePeopleStore((s) => s.togglePrayFor);

  const Icon = kind === "reach" ? Mail : Heart;
  const intent =
    kind === "reach"
      ? person.prayerIntentions[0]?.text ?? person.notes ?? "Reach out when you can."
      : person.prayerIntentions[0]?.text ?? "Hold them in prayer today.";

  return (
    <motion.div
      layout
      className={cn("paper-soft flex items-start gap-3 p-4", className)}
    >
      <button onClick={() => navigate(`/people/${person.id}`)} className="flex-shrink-0">
        <Avatar src={person.avatar} name={person.name} size={44} />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-text-muted" />
          <span className="font-heading text-[16px] text-text line-clamp-1">{person.name}</span>
        </div>
        <p className="caption line-clamp-2">{intent}</p>
        <span className="text-[11px] text-text-muted">
          last contact {person.lastInteraction ? timeAgo(person.lastInteraction) : "—"}
        </span>
      </div>
      {kind === "reach" ? (
        <Button size="sm" variant="secondary" onClick={() => markContacted(person.id)}>
          Reached out
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => togglePrayFor(person.id)}>
          Done
        </Button>
      )}
    </motion.div>
  );
}