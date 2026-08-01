import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Heart,
  Mail,
  Plus,
  Link as LinkIcon,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { Button, IconButton } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Textarea, Input } from "@/components/ui/Input";
import { TimelineItem } from "@/components/timeline/TimelineItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePeopleStore } from "@/store/usePeopleStore";
import { JOURNEY_TYPES, PLATFORM_META } from "@/lib/constants";
import { formatDateLong, timeAgo, journeyYearsFor } from "@/lib/format";

export default function PersonDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const person = usePeopleStore((s) => s.people.find((p) => p.id === id));
  const togglePrayFor = usePeopleStore((s) => s.togglePrayFor);
  const markContacted = usePeopleStore((s) => s.markContacted);
  const deletePerson = usePeopleStore((s) => s.deletePerson);
  const addTimelineEvent = usePeopleStore((s) => s.addTimelineEvent);
  const removeTimelineEvent = usePeopleStore((s) => s.removeTimelineEvent);
  const addPrayerIntention = usePeopleStore((s) => s.addPrayerIntention);
  const removePrayerIntention = usePeopleStore((s) => s.removePrayerIntention);

  const [showEvent, setShowEvent] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const [evTitle, setEvTitle] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evNote, setEvNote] = useState("");
  const [prayerText, setPrayerText] = useState("");

  if (!person) {
    return (
      <PageTransition>
        <EmptyState
          title="This person has faded"
          caption="They may have been removed. Your journey continues."
          action={<Button onClick={() => navigate("/people")}>Back to people</Button>}
        />
      </PageTransition>
    );
  }

  const jt = JOURNEY_TYPES.find((t) => t.id === person.journeyType);
  const platform = PLATFORM_META[person.platform];

  function saveEvent() {
    if (!person || !evTitle.trim() || !evDate) return;
    addTimelineEvent(person.id, {
      title: evTitle.trim(),
      date: new Date(evDate).toISOString(),
      note: evNote.trim() || undefined,
      kind: "memory",
    });
    setEvTitle(""); setEvDate(""); setEvNote(""); setShowEvent(false);
  }

  function savePrayer() {
    if (!person || !prayerText.trim()) return;
    addPrayerIntention(person.id, prayerText.trim());
    setPrayerText(""); setShowPrayer(false);
  }

  function onDelete() {
    if (!person) return;
    if (window.confirm(`Remove ${person.name} from your journey? This cannot be undone.`)) {
      deletePerson(person.id);
      navigate("/people");
    }
  }

  return (
    <PageTransition>
      <header className="flex items-center justify-between pt-8 pb-2">
        <IconButton label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} strokeWidth={1.8} />
        </IconButton>
        <div className="flex gap-1">
          <IconButton label="Edit" onClick={() => navigate(`/people/${person.id}/edit`)}>
            <Pencil size={18} strokeWidth={1.7} />
          </IconButton>
          <IconButton label="Remove" onClick={onDelete}>
            <Trash2 size={18} strokeWidth={1.7} />
          </IconButton>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-center gap-4 pt-6 text-center">
          <Avatar src={person.avatar} name={person.name} platform={person.platform} size={96} />
          <div className="flex flex-col gap-1">
            <h1 className="text-hero">{person.name}</h1>
            {person.bio && <p className="editorial max-w-[40ch]">{person.bio}</p>}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {jt && <Chip color={jt.color}>{jt.label}</Chip>}
            {person.followUp && <Chip color="#C88A6C">To reach out</Chip>}
            {person.prayFor && <Chip color="#C88A6C">In prayer</Chip>}
          </div>
        </section>

        <div className="flex gap-3">
          <Button
            variant={person.followUp ? "secondary" : "primary"}
            fullWidth
            onClick={() => markContacted(person.id)}
          >
            <Mail size={15} strokeWidth={1.8} /> Reached out
          </Button>
          <Button
            variant={person.prayFor ? "secondary" : "outline"}
            fullWidth
            onClick={() => togglePrayFor(person.id)}
          >
            <Heart size={15} strokeWidth={1.8} /> {person.prayFor ? "Praying" : "Pray"}
          </Button>
        </div>

        {person.whyTheyMatter && (
          <section className="paper p-6">
            <span className="label">Why they matter</span>
            <p className="editorial mt-3 text-[16px] leading-relaxed">{person.whyTheyMatter}</p>
          </section>
        )}

        <section className="paper p-6">
          <div className="grid grid-cols-2 gap-y-4">
            {person.whereMet && (
              <Detail icon={<MapPin size={14} />} label="Where you met" value={person.whereMet} />
            )}
            {person.dateMet && (
              <Detail icon={<Calendar size={14} />} label="When you met" value={formatDateLong(person.dateMet)} />
            )}
            <Detail icon={<Calendar size={14} />} label="Years together" value={`${journeyYearsFor(person.dateMet, person.timeline.map((e) => e.date))}`} />
            <Detail icon={<Mail size={14} />} label="Last contact" value={person.lastInteraction ? timeAgo(person.lastInteraction) : "—"} />
            {person.profileUrl && (
              <a
                href={person.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-1 transition-colors hover:text-green"
              >
                <span className="flex items-center gap-1.5 text-text-muted">
                  <LinkIcon size={14} />
                  <span className="label">Profile</span>
                </span>
                <span className="text-text line-clamp-1">{platform.label} ↗</span>
                <span className="caption line-clamp-1">{person.profileUrl}</span>
              </a>
            )}
          </div>
          {person.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-divider pt-4">
              {person.tags.map((t) => (
                <span key={t} className="rounded-full bg-card-soft px-2.5 py-1 text-[12px] text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
          )}
        </section>

        {person.recentLinks.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="label">Recent links</span>
            <div className="flex flex-col gap-2">
              {person.recentLinks.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="paper flex items-center gap-3 p-4 transition-colors hover:bg-card-soft">
                  <LinkIcon size={16} className="text-text-muted" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-[15px] text-text line-clamp-1">{l.title}</span>
                    <span className="caption line-clamp-1">{l.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section">Prayer intentions</h2>
            <IconButton label="Add intention" onClick={() => setShowPrayer(!showPrayer)}>
              {showPrayer ? <X size={18} /> : <Plus size={18} strokeWidth={1.8} />}
            </IconButton>
          </div>
          {showPrayer && (
            <div className="flex gap-2 anim-fade">
              <Input
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Hold this in prayer…"
                className="flex-1"
              />
              <Button size="md" onClick={savePrayer}>Add</Button>
            </div>
          )}
          {person.prayerIntentions.length === 0 ? (
            <p className="caption">No intentions written yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {person.prayerIntentions.map((i) => (
                <div key={i.id} className="paper-soft flex items-center gap-3 p-4">
                  <Heart size={14} className="text-text-muted" />
                  <span className="flex-1 text-[15px] text-text">{i.text}</span>
                  <IconButton label="Remove" onClick={() => removePrayerIntention(person.id, i.id)}>
                    <X size={16} />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-section">Your memories</h2>
            <IconButton label="Add memory" onClick={() => setShowEvent(!showEvent)}>
              {showEvent ? <X size={18} /> : <Plus size={18} strokeWidth={1.8} />}
            </IconButton>
          </div>
          {showEvent && (
            <div className="paper-soft flex flex-col gap-3 p-4 anim-fade">
              <Input label="Title" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="A moment worth keeping" />
              <Input label="Date" type="date" value={evDate} onChange={(e) => setEvDate(e.target.value)} />
              <Textarea label="Note" value={evNote} onChange={(e) => setEvNote(e.target.value)} placeholder="A line or two" />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowEvent(false)}>Cancel</Button>
                <Button onClick={saveEvent} disabled={!evTitle.trim() || !evDate}>Add to story</Button>
              </div>
            </div>
          )}
          {person.timeline.length === 0 ? (
            <p className="caption">The story begins when you write the first memory.</p>
          ) : (
            <div className="paper p-6">
              {person.timeline
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((e, i, arr) => (
                  <div key={e.id} className="group flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <TimelineItem event={{ ...e, personId: person.id, personName: person.name, avatar: person.avatar }} last={i === arr.length - 1} />
                    </div>
                    <button
                      onClick={() => removeTimelineEvent(person.id, e.id)}
                      aria-label={`Remove memory: ${e.title}`}
                      className="mt-1 rounded-full p-2 text-text-muted transition-colors hover:bg-card-soft hover:text-[#B5654A]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>

        {person.notes && (
          <section className="flex flex-col gap-2">
            <span className="label">Journey notes</span>
            <p className="editorial text-[15px] leading-relaxed">{person.notes}</p>
          </section>
        )}
      </div>
    </PageTransition>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-text-muted">
        {icon}
        <span className="label">{label}</span>
      </span>
      <span className="text-[15px] text-text">{value}</span>
    </div>
  );
}