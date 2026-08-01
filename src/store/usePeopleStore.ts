import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Person, PrayerIntention, Saint, TimelineEvent } from "@/lib/types";
import { STORAGE_KEY } from "@/lib/constants";

function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface PeopleState {
  people: Person[];
  saints: Saint[];
  hydrated: boolean;
  addPerson: (p: Omit<Person, "id" | "createdAt" | "updatedAt">) => string;
  updatePerson: (id: string, patch: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  addTimelineEvent: (id: string, ev: Omit<TimelineEvent, "id">) => void;
  removeTimelineEvent: (personId: string, eventId: string) => void;
  addPrayerIntention: (id: string, text: string) => void;
  removePrayerIntention: (personId: string, intentionId: string) => void;
  toggleFollowUp: (id: string) => void;
  togglePrayFor: (id: string) => void;
  markContacted: (id: string, when?: string) => void;
  clearAll: () => void;
  addSaint: (s: Omit<Saint, "id" | "createdAt">) => string;
  removeSaint: (id: string) => void;
}

export const usePeopleStore = create<PeopleState>()(
  persist(
    (set, get) => ({
      people: [],
      saints: [],
      hydrated: false,

      addPerson: (p) => {
        const now = new Date().toISOString();
        const id = uid("p");
        const person: Person = {
          ...p,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ people: [person, ...s.people] }));
        return id;
      },

      updatePerson: (id, patch) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      deletePerson: (id) =>
        set((s) => ({ people: s.people.filter((p) => p.id !== id) })),

      getPerson: (id) => get().people.find((p) => p.id === id),

      addTimelineEvent: (id, ev) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? {
                  ...p,
                  timeline: [...p.timeline, { ...ev, id: uid("e") }].sort(
                    (a, b) => a.date.localeCompare(b.date)
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      removeTimelineEvent: (personId, eventId) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  timeline: p.timeline.filter((e) => e.id !== eventId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      addPrayerIntention: (id, text) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? {
                  ...p,
                  prayerIntentions: [
                    ...p.prayerIntentions,
                    { id: uid("pi"), text, date: new Date().toISOString() } satisfies PrayerIntention,
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      removePrayerIntention: (personId, intentionId) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  prayerIntentions: p.prayerIntentions.filter(
                    (i) => i.id !== intentionId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      toggleFollowUp: (id) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? { ...p, followUp: !p.followUp, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      togglePrayFor: (id) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? { ...p, prayFor: !p.prayFor, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      markContacted: (id, when) =>
        set((s) => ({
          people: s.people.map((p) =>
            p.id === id
              ? {
                  ...p,
                  lastInteraction: when ?? new Date().toISOString(),
                  followUp: false,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      clearAll: () => set({ people: [] }),

      addSaint: (s) => {
        const id = uid("saint");
        set((state) => ({
          saints: [
            ...state.saints,
            { ...s, id, createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },

      removeSaint: (id) =>
        set((s) => ({ saints: s.saints.filter((st) => st.id !== id) })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);