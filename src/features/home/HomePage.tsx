import { useNavigate } from "react-router-dom";
import { Plus, CalendarHeart, Activity } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { JourneyOverviewCard } from "@/components/cards/JourneyOverviewCard";
import { PersonRow } from "@/components/cards/PersonCard";
import { ReminderCard } from "@/components/cards/ReminderCard";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePeopleStore } from "@/store/usePeopleStore";
import {
  peopleToReachOut,
  recentlyAdded,
  upcomingBirthdays,
  prayingFor,
  recentMemories,
} from "@/lib/selectors";
import { formatDate, upcomingInDays } from "@/lib/format";

export default function HomePage() {
  const navigate = useNavigate();
  const people = usePeopleStore((s) => s.people);

  const reachOut = peopleToReachOut(people).slice(0, 4);
  const recent = recentlyAdded(people, 6);
  const birthdays = upcomingBirthdays(people, 4);
  const prayer = prayingFor(people).slice(0, 4);
  const memories = recentMemories(people, 4);

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 pt-10">
        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[12px] bg-card-soft">
                <img src="/Logo.png" alt="Neph" className="h-full w-full object-contain" />
              </div>
              <span
                className="text-[26px] leading-none tracking-[-0.02em] text-text"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
              >
                Neph
              </span>
            </div>
            <p className="editorial text-[17px] leading-snug">
              Who has become part of your journey?
            </p>
          </div>
          <IconButton label="Remember someone" onClick={() => navigate("/people/new")}>
            <Plus size={22} strokeWidth={1.8} />
          </IconButton>
        </header>

        <JourneyOverviewCard people={people} />

        {people.length === 0 && (
          <EmptyState
            title="Your journey book begins with one name"
            caption="Remember the first person who comes to mind. They are already part of your story."
            action={
              <button className="btn btn-outline mt-2" onClick={() => navigate("/people/new")}>
                Remember someone
              </button>
            }
          />
        )}

        {reachOut.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionHeader
              title="People to Reach Out"
              caption="Those quietly waiting to be remembered"
            />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-[var(--side-padding)] px-[var(--side-padding)]">
              {reachOut.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </div>
          </section>
        )}

        {prayer.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Prayer Reminders" caption="Hold them gently today" />
            <div className="flex flex-col gap-3">
              {prayer.map((p) => (
                <ReminderCard key={p.id} person={p} kind="prayer" />
              ))}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionHeader title="Recently Added" caption="Newcomers to your journey" />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-[var(--side-padding)] px-[var(--side-padding)]">
              {recent.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </div>
          </section>
        )}

        {birthdays.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Upcoming Birthdays" caption="A day to remember them well" />
            <div className="flex flex-col gap-2">
              {birthdays.map((p) => {
                const days = upcomingInDays(p.birthday) ?? 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/people/${p.id}`)}
                    className="paper flex items-center gap-4 p-4 text-left"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card-soft text-text-secondary">
                      <CalendarHeart size={18} strokeWidth={1.6} />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="font-heading text-[17px] text-text line-clamp-1">{p.name}</span>
                      <span className="caption">{formatDate(p.birthday)}</span>
                    </div>
                    <span className="caption text-text-muted">
                      {days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {memories.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionHeader title="Recent Memories" caption="A note from your journey" />
            <div className="paper p-6">
              {memories.map((e, i) => (
                <TimelineItem
                  key={e.id}
                  event={e}
                  last={i === memories.length - 1}
                  showPerson
                  onClick={() => navigate(`/people/${e.personId}`)}
                />
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center justify-center gap-2 pt-2 text-text-muted">
          <Activity size={14} strokeWidth={1.4} />
          <span className="text-[12px]">Neph remembers quietly</span>
        </div>
      </div>
    </PageTransition>
  );
}