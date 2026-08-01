import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { IconButton, Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { usePeopleStore } from "@/store/usePeopleStore";

export default function NewMemoryPage() {
  const navigate = useNavigate();
  const people = usePeopleStore((s) => s.people);
  const addTimelineEvent = usePeopleStore((s) => s.addTimelineEvent);

  const [personId, setPersonId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");

  const person = people.find((p) => p.id === personId);

  function addTag() {
    const t = tagDraft.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagDraft("");
  }

  function save() {
    if (!personId || !title.trim() || !year) return;
    const date = new Date(`${year}-01-01`).toISOString();
    addTimelineEvent(personId, {
      title: title.trim(),
      note: note.trim() || undefined,
      date,
      kind: "memory",
      tags: tags.length ? tags : undefined,
    });
    navigate("/journey");
  }

  if (people.length === 0) {
    return (
      <PageTransition>
        <div className="flex items-center justify-between pt-8 pb-4">
          <IconButton label="Back" onClick={() => navigate("/journey")}>
            <ArrowLeft size={20} strokeWidth={1.8} />
          </IconButton>
        </div>
        <EmptyState
          title="No one to remember yet"
          caption="Add someone to your journey first, then keep a memory of them here."
          action={<Button onClick={() => navigate("/people/new")}>Remember someone</Button>}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <header className="flex items-center justify-between pt-8 pb-4">
        <IconButton label="Back" onClick={() => navigate("/journey")}>
          <ArrowLeft size={20} strokeWidth={1.8} />
        </IconButton>
        <span className="label">A new memory</span>
        <Button size="sm" onClick={save} disabled={!personId || !title.trim() || !year}>
          Keep
        </Button>
      </header>

      <div className="flex flex-col gap-5">
        <p className="text-page max-w-[20ch]">Remember a moment with someone.</p>

        <div className="flex flex-col gap-2">
          <span className="field-label">Who</span>
          <Select value={personId} onChange={(e) => setPersonId(e.target.value)}>
            <option value="">Choose someone…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          {person && (
            <div className="flex items-center gap-3 pt-1 anim-fade">
              <Avatar src={person.avatar} name={person.name} size={36} />
              <span className="font-heading text-[17px] text-text">{person.name}</span>
            </div>
          )}
        </div>

        <Input
          label="What happened"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A memory worth keeping"
        />

        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
        />

        <Textarea
          label="Description"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A line or two about that moment"
        />

        <div className="flex flex-col gap-2">
          <span className="field-label">Tags</span>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Chip key={t} active onClick={() => setTags(tags.filter((x) => x !== t))}>
                  {t} ×
                </Chip>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="field flex-1"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag category, press enter"
            />
            <Button variant="secondary" onClick={addTag}>
              <Plus size={16} /> Add
            </Button>
          </div>
        </div>

        <Button fullWidth onClick={save} disabled={!personId || !title.trim() || !year}>
          Keep this memory
        </Button>
      </div>
    </PageTransition>
  );
}