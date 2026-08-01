import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { IconButton } from "@/components/ui/Button";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { usePeopleStore } from "@/store/usePeopleStore";
import { allEventsByYear } from "@/lib/selectors";

export default function JourneyPage() {
  const navigate = useNavigate();
  const people = usePeopleStore((s) => s.people);
  const byYear = allEventsByYear(people);

  const hasEvents = people.length > 0 && byYear.size > 0;

  return (
    <PageTransition>
      <PageHeader
        title="Journey"
        subtitle="A chronological keeping of your memories"
        action={
          <IconButton label="Keep a memory" onClick={() => navigate("/journey/new")}>
            <Plus size={22} strokeWidth={1.8} />
          </IconButton>
        }
      />

      {hasEvents ? (
        <div className="flex flex-col gap-10 pb-6">
          {[...byYear.entries()].map(([year, events]) => (
            <section key={year} className="flex flex-col gap-1">
              <div className="sticky top-2 z-10 -mx-[var(--side-padding)] mb-2 bg-bg/85 px-[var(--side-padding)] py-2 backdrop-blur">
                <span className="font-heading text-[34px] leading-none text-text">{year}</span>
                <span className="caption ml-2">
                  {events.length} {events.length === 1 ? "memory" : "memories"}
                </span>
              </div>
              <div className="paper p-6">
                {events.map((e, i) => (
                  <TimelineItem
                    key={e.id}
                    event={e}
                    last={i === events.length - 1}
                    showPerson
                    onClick={() => navigate(`/people/${e.personId}`)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 px-8 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card-soft text-text-secondary">
            <Plus size={24} strokeWidth={1.4} />
          </div>
          <h3 className="text-section">No memories kept yet</h3>
          <p className="editorial max-w-[40ch] text-[15px]">
            A memory is a small keeping of a moment — one person, one year,
            a line or two. Begin with one.
          </p>
          <button className="btn btn-outline" onClick={() => navigate("/journey/new")}>
            <Plus size={16} strokeWidth={1.8} /> Keep a memory
          </button>
        </div>
      )}
    </PageTransition>
  );
}