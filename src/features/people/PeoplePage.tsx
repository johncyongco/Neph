import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchBar } from "@/components/ui/SearchBar";
import { Chip } from "@/components/ui/Chip";
import { PersonCard } from "@/components/cards/PersonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton, Button } from "@/components/ui/Button";
import { usePeopleStore } from "@/store/usePeopleStore";

type QuickFilter = "all" | "followup" | "prayer";

export default function PeoplePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const people = usePeopleStore((s) => s.people);
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<QuickFilter>(
    (params.get("filter") as QuickFilter) || "all"
  );
  const [tag, setTag] = useState<string | null>(null);

  // Categories derive from the tags the user has actually added to people.
  const allTags = useMemo(
    () => Array.from(new Set(people.flatMap((p) => p.tags))).sort(),
    [people]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      if (quick === "followup" && !p.followUp) return false;
      if (quick === "prayer" && !p.prayFor) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      const hay = [p.name, p.bio, p.username, p.notes, ...p.tags].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [people, query, quick, tag]);

  const quickFilters: { id: QuickFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "followup", label: "To reach out" },
    { id: "prayer", label: "In prayer" },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="People"
        subtitle="The ones who have become part of your story"
        action={
          <IconButton label="Remember someone" onClick={() => navigate("/people/new")}>
            <Plus size={22} strokeWidth={1.8} />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name or tag" />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-[var(--side-padding)] px-[var(--side-padding)]">
          {quickFilters.map((f) => (
            <Chip key={f.id} active={quick === f.id} onClick={() => setQuick(f.id)}>
              {f.label}
            </Chip>
          ))}
          {allTags.length > 0 && <span className="mx-1 self-center text-divider">·</span>}
          <Chip active={tag === null} onClick={() => setTag(null)}>
            All categories
          </Chip>
          {allTags.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={people.length === 0 ? "No one here yet" : "No matches"}
            caption={
              people.length === 0
                ? "Remember the first person who shaped your journey."
                : "Try a different word or category."
            }
            action={
              people.length === 0 ? (
                <Button variant="outline" className="mt-2" onClick={() => navigate("/people/new")}>
                  <Plus size={16} strokeWidth={1.8} /> Remember someone
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}