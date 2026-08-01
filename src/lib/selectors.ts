import type { Person, TimelineEvent } from "@/lib/types";
import { upcomingInDays } from "./format";

function eventYear(e: TimelineEvent): number | null {
  const y = Number(new Date(e.date).getFullYear());
  return Number.isFinite(y) && y > 1900 ? y : null;
}

// Years span of the journey — driven by both `dateMet` and the years that
// hold memories in the Journey timeline, so the Home stat matches the tab.
export function journeyYears(people: Person[]): number {
  const years: number[] = [];
  for (const p of people) {
    const met = p.dateMet ? Number(new Date(p.dateMet).getFullYear()) : NaN;
    if (Number.isFinite(met) && met > 1900) years.push(met);
    for (const e of p.timeline) {
      const y = eventYear(e);
      if (y) years.push(y);
    }
  }
  if (years.length === 0) return 0;
  const earliest = Math.min(...years);
  return Math.max(1, new Date().getFullYear() - earliest + 1);
}

// Distinct years that hold memories — matches the year groups on the tab.
export function journeyYearCount(people: Person[]): number {
  const set = new Set<number>();
  for (const p of people) {
    for (const e of p.timeline) {
      const y = eventYear(e);
      if (y) set.add(y);
    }
  }
  return set.size;
}

export function needFollowUp(people: Person[]): Person[] {
  return people.filter((p) => p.followUp);
}

export function prayingFor(people: Person[]): Person[] {
  return people.filter((p) => p.prayFor);
}

export function peopleToReachOut(people: Person[]): Person[] {
  return needFollowUp(people)
    .slice()
    .sort((a, b) => (a.lastInteraction ?? "").localeCompare(b.lastInteraction ?? ""));
}

export function recentlyAdded(people: Person[], limit = 6): Person[] {
  return people
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function upcomingBirthdays(people: Person[], limit = 4): Person[] {
  return people
    .filter((p) => p.birthday)
    .map((p) => ({ p, in: upcomingInDays(p.birthday) ?? Infinity }))
    .sort((a, b) => a.in - b.in)
    .slice(0, limit)
    .map((x) => x.p);
}

export type FlatEvent = TimelineEvent & { personId: string; personName: string; avatar?: string };

export function recentMemories(people: Person[], limit = 5): FlatEvent[] {
  return people
    .flatMap((p) =>
      p.timeline.map((e) => ({ ...e, personId: p.id, personName: p.name, avatar: p.avatar }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function allEventsByYear(people: Person[]): Map<string, FlatEvent[]> {
  const map = new Map<string, FlatEvent[]>();
  for (const p of people) {
    for (const e of p.timeline) {
      const y = new Date(e.date).getFullYear().toString();
      const arr = map.get(y) ?? [];
      arr.push({ ...e, personId: p.id, personName: p.name, avatar: p.avatar });
      map.set(y, arr);
    }
  }
  for (const [y, arr] of map) {
    arr.sort((a, b) => b.date.localeCompare(a.date));
    map.set(y, arr);
  }
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

export function journeyGraffiti(value: number): string {
  return String(value).padStart(2, "0");
}