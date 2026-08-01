import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { JOURNEY_TYPES, PLATFORM_META } from "@/lib/constants";
import type { Person } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/format";
import { cn } from "@/lib/tw";

interface PersonCardProps {
  person: Person;
  variant?: "list" | "row";
  className?: string;
}

export function PersonCard({ person, variant = "list", className }: PersonCardProps) {
  const navigate = useNavigate();
  const journeyType = JOURNEY_TYPES.find((t) => t.id === person.journeyType);
  const platform = PLATFORM_META[person.platform];
  const title =
    journeyType?.label ?? platform.label;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      onClick={() => navigate(`/people/${person.id}`)}
      className={cn(
        "paper flex w-full items-center gap-4 p-4 text-left",
        variant === "row" && "min-w-[260px] flex-shrink-0",
        className
      )}
    >
      <Avatar src={person.avatar} name={person.name} platform={person.platform} size={56} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[19px] leading-tight text-text line-clamp-1">
            {person.name}
          </span>
        </div>
        <span className="caption line-clamp-1">{title}</span>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-text-muted">
          {person.dateMet && <span>Since {formatDate(person.dateMet).split(",")[0]}</span>}
          <span className="text-divider">·</span>
          <span>{person.lastInteraction ? timeAgo(person.lastInteraction) : "no contact yet"}</span>
        </div>
        {person.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {person.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-card-soft px-2.5 py-1 text-[11px] text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}

export function PersonRow({ person }: { person: Person }) {
  return <PersonCard person={person} variant="row" />;
}

export function JourneyTypeChip({ person }: { person: Person }) {
  const t = JOURNEY_TYPES.find((x) => x.id === person.journeyType);
  if (!t) return null;
  return <Chip color={t.color}>{t.label}</Chip>;
}