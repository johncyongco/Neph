import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateLong } from "@/lib/format";
import { cn } from "@/lib/tw";
import type { FlatEvent } from "@/lib/selectors";

interface TimelineItemProps {
  event: FlatEvent;
  index?: number;
  last?: boolean;
  onClick?: () => void;
  showPerson?: boolean;
}

export function TimelineItem({ event, last, onClick, showPerson }: TimelineItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        "relative flex w-full gap-4 text-left",
        !last && "pb-6"
      )}
    >
      <div className="flex flex-col items-center">
        <span className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full border-2 border-bg bg-green" />
        {!last && <span className="mt-1 w-px flex-1 bg-divider" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="caption text-[12px] text-text-muted">{formatDateLong(event.date)}</span>
        <span className="font-heading text-[18px] leading-snug text-text">{event.title}</span>
        {event.note && <p className="caption line-clamp-2">{event.note}</p>}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {event.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-card-soft px-2.5 py-1 text-[11px] text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {showPerson && (
          <span className="mt-1 flex items-center gap-2 text-[12px] text-text-muted">
            <Avatar src={event.avatar} name={event.personName} size={18} />
            {event.personName}
          </span>
        )}
      </div>
    </motion.button>
  );
}