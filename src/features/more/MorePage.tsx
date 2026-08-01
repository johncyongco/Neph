import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Archive,
  Download,
  Bell,
  Moon,
  Info,
  Trash2,
  Check,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePeopleStore } from "@/store/usePeopleStore";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { isSupabaseConfigured } from "@/services/supabase";
import { cn } from "@/lib/tw";

export default function MorePage() {
  const navigate = useNavigate();
  const people = usePeopleStore((s) => s.people);
  const clearAll = usePeopleStore((s) => s.clearAll);
  const reseed = usePeopleStore((s) => s.reseed);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(people, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neph-journey.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(people, null, 2));
  }

  function onClear() {
    if (window.confirm("Remove everyone from your journey? This empties the book.")) {
      clearAll();
    }
  }

  return (
    <PageTransition>
      <PageHeader title="More" subtitle="The quiet work of keeping" />
      <div className="flex flex-col gap-8">
        <section className="paper p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card-soft text-text-secondary">
              <User size={22} strokeWidth={1.6} />
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-[22px] text-text">{APP_NAME}</span>
              <span className="caption">{APP_TAGLINE}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-divider pt-4 text-center">
            <Stat label="People" value={people.length} />
            <Stat label="Memories" value={people.reduce((n, p) => n + p.timeline.length, 0)} />
            <Stat label="Prayers" value={people.reduce((n, p) => n + p.prayerIntentions.length, 0)} />
          </div>
        </section>

        <Section title="Journey">
          <Row icon={<Download size={17} />} label="Export journey" sub="Save a JSON copy" onClick={exportJson} />
          <Row icon={<Check size={17} />} label="Copy to clipboard" sub="Paste anywhere" onClick={copyToClipboard} />
          <Row icon={<Archive size={17} />} label="Restore seed people" sub="Bring back the examples" onClick={reseed} />
          <Row icon={<Trash2 size={17} />} label="Clear everyone" sub="Empty the book" danger onClick={onClear} />
        </Section>

        <Section title="Preferences">
          <Row icon={<Moon size={17} />} label="Appearance" sub={dark ? "Dark" : "Light"} onClick={toggleDark} trailing={
            <span className={cn("h-5 w-9 rounded-full p-0.5 transition-colors", dark ? "bg-text" : "bg-divider")}>
              <span className={cn("block h-4 w-4 rounded-full bg-card transition-transform", dark && "translate-x-4")} />
            </span>
          } />
          <Row icon={<Bell size={17} />} label="Notifications" sub="Reminders to remember" onClick={() => {}} />
          <Row icon={<Info size={17} />} label="Sync" sub={isSupabaseConfigured ? "Supabase connected" : "Local only — Supabase not configured"} onClick={() => navigate("/more")} />
        </Section>

        <Section title="About">
          <div className="paper-soft flex flex-col gap-3 p-6">
            <p className="editorial text-[15px] leading-relaxed">
              Neph is a journal, not a contact book. It remembers the people who became part of your story —
              not the ones you collected.
            </p>
            <p className="caption">
              Built to belong beside Agapetoi and Custody, sharing their quiet design language.
            </p>
          </div>
        </Section>

        <p className="pb-2 text-center text-[12px] text-text-muted">Neph · {APP_TAGLINE}</p>
      </div>
    </PageTransition>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-heading text-[24px] leading-none text-text">{value}</span>
      <span className="label">{label}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <span className="label">{title}</span>
      <div className="paper flex flex-col divide-y divide-divider">{children}</div>
    </section>
  );
}

function Row({
  icon, label, sub, onClick, danger, trailing,
}: {
  icon: React.ReactNode; label: string; sub?: string; onClick: () => void; danger?: boolean; trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-card-soft"
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", danger ? "bg-[rgba(181,101,74,0.08)] text-[#B5654A]" : "bg-card-soft text-text-secondary")}>
        {icon}
      </span>
      <div className="flex flex-1 flex-col">
        <span className={cn("text-[15px]", danger ? "text-[#B5654A]" : "text-text")}>{label}</span>
        {sub && <span className="caption line-clamp-1">{sub}</span>}
      </div>
      {trailing}
    </button>
  );
}