import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Download,
  Bell,
  Moon,
  Info,
  Trash2,
  Cross,
  Plus,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button, IconButton } from "@/components/ui/Button";
import { usePeopleStore } from "@/store/usePeopleStore";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { isSupabaseConfigured } from "@/services/supabase";
import { cn } from "@/lib/tw";

export default function MorePage() {
  const navigate = useNavigate();
  const people = usePeopleStore((s) => s.people);
  const saints = usePeopleStore((s) => s.saints);
  const addSaint = usePeopleStore((s) => s.addSaint);
  const removeSaint = usePeopleStore((s) => s.removeSaint);
  const clearAll = usePeopleStore((s) => s.clearAll);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [showSaint, setShowSaint] = useState(false);
  const [saintName, setSaintName] = useState("");
  const [saintTitle, setSaintTitle] = useState("");
  const [saintPatron, setSaintPatron] = useState("");
  const [saintFeast, setSaintFeast] = useState("");
  const [saintIntercession, setSaintIntercession] = useState("");

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  async function exportPdf() {
    const { exportPeoplePdf } = await import("@/services/exportPdf");
    exportPeoplePdf(people);
  }

  function onClear() {
    if (window.confirm("Remove everyone from your journey? This empties the book.")) {
      clearAll();
    }
  }

  function saveSaint() {
    if (!saintName.trim()) return;
    addSaint({
      name: saintName.trim(),
      title: saintTitle.trim() || undefined,
      patronOf: saintPatron.trim() || undefined,
      feastDay: saintFeast.trim() || undefined,
      intercession: saintIntercession.trim() || undefined,
    });
    setSaintName("");
    setSaintTitle("");
    setSaintPatron("");
    setSaintFeast("");
    setSaintIntercession("");
    setShowSaint(false);
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

        <Section title="Journey Saints">
          {saints.length === 0 ? (
            <p className="caption p-5">The saints who journey with you, kept close.</p>
          ) : (
            saints.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-card-soft text-text-secondary">
                  <Cross size={16} strokeWidth={1.6} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] text-text line-clamp-1">{s.name}</span>
                    {s.title && <span className="caption line-clamp-1">{s.title}</span>}
                  </div>
                  {s.patronOf && <span className="caption line-clamp-1">Patron of {s.patronOf}</span>}
                  {s.feastDay && <span className="caption line-clamp-1">Feast {s.feastDay}</span>}
                  {s.intercession && <span className="caption line-clamp-1">Intercession for {s.intercession}</span>}
                </div>
                <IconButton label="Remove saint" onClick={() => removeSaint(s.id)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            ))
          )}
          {showSaint ? (
            <div className="flex flex-col gap-3 p-4 anim-fade">
              <Input label="Name" value={saintName} onChange={(e) => setSaintName(e.target.value)} placeholder="e.g. St. Thérèse of Lisieux" />
              <Input label="Title" value={saintTitle} onChange={(e) => setSaintTitle(e.target.value)} placeholder="e.g. Doctor of the Church" />
              <Input label="Patron of" value={saintPatron} onChange={(e) => setSaintPatron(e.target.value)} placeholder="e.g. missions" />
              <Input label="Feast Day" value={saintFeast} onChange={(e) => setSaintFeast(e.target.value)} placeholder="e.g. October 1" />
              <Input label="Intercession for" value={saintIntercession} onChange={(e) => setSaintIntercession(e.target.value)} placeholder="e.g. my vocation" />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSaint(false)}>Cancel</Button>
                <Button size="sm" onClick={saveSaint} disabled={!saintName.trim()}>Add saint</Button>
              </div>
            </div>
          ) : (
            <Row icon={<Plus size={17} />} label="Add a saint" sub="Name, patron, feast day" onClick={() => setShowSaint(true)} />
          )}
        </Section>

        <Section title="Journey">
          <Row icon={<Download size={17} />} label="Export Neph" sub="PDF of contacts & memories" onClick={exportPdf} />
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