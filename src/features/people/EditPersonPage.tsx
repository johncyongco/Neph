import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Plus } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { IconButton, Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { PhotoPicker } from "@/components/person/PhotoPicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePeopleStore } from "@/store/usePeopleStore";
import { JOURNEY_TYPES } from "@/lib/constants";
import type { JourneyType } from "@/lib/types";

export default function EditPersonPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const person = usePeopleStore((s) => s.people.find((p) => p.id === id));
  const updatePerson = usePeopleStore((s) => s.updatePerson);

  const [name, setName] = useState(person?.name ?? "");
  const [avatar, setAvatar] = useState(person?.avatar ?? "");
  const [bio, setBio] = useState(person?.bio ?? "");
  const [website, setWebsite] = useState(person?.website ?? "");
  const [journeyType, setJourneyType] = useState<JourneyType>(person?.journeyType ?? "friend");
  const [why, setWhy] = useState(person?.whyTheyMatter ?? "");
  const [whereMet, setWhereMet] = useState(person?.whereMet ?? "");
  const [dateMet, setDateMet] = useState(person?.dateMet?.slice(0, 10) ?? "");
  const [birthday, setBirthday] = useState(person?.birthday?.slice(0, 10) ?? "");
  const [notes, setNotes] = useState(person?.notes ?? "");
  const [tags, setTags] = useState<string[]>(person?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [followUp, setFollowUp] = useState(person?.followUp ?? false);
  const [prayFor, setPrayFor] = useState(person?.prayFor ?? false);

  if (!person) {
    return (
      <PageTransition>
        <EmptyState title="Nothing to edit" action={<Button onClick={() => navigate("/people")}>Back</Button>} />
      </PageTransition>
    );
  }

  function addTag() {
    const t = tagDraft.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagDraft("");
  }

  function save() {
    updatePerson(person!.id, {
      name: name.trim() || person!.name,
      avatar: avatar || undefined,
      bio: bio || undefined,
      website: website || undefined,
      journeyType,
      whyTheyMatter: why || undefined,
      whereMet: whereMet || undefined,
      dateMet: dateMet || undefined,
      birthday: birthday || undefined,
      notes: notes || undefined,
      tags,
      followUp,
      prayFor,
    });
    navigate(`/people/${person!.id}`);
  }

  return (
    <PageTransition>
      <header className="flex items-center justify-between pt-8 pb-4">
        <IconButton label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} strokeWidth={1.8} />
        </IconButton>
        <span className="label">Editing</span>
        <Button size="sm" onClick={save}>Save</Button>
      </header>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <PhotoPicker value={avatar || undefined} name={name} onChange={(v) => setAvatar(v ?? "")} size={64} />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        </div>
        <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A line about them" />
        <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <Select label="Journey type" value={journeyType} onChange={(e) => setJourneyType(e.target.value as JourneyType)}>
          {JOURNEY_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </Select>
        <Textarea label="Why they matter" value={why} onChange={(e) => setWhy(e.target.value)} />
        <div className="flex gap-3">
          <Input label="Where you met" value={whereMet} onChange={(e) => setWhereMet(e.target.value)} />
          <Input label="When" type="date" value={dateMet} onChange={(e) => setDateMet(e.target.value)} />
        </div>
        <Input label="Birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        <Textarea label="Journey notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="flex flex-col gap-2">
          <span className="field-label">Tags</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Chip key={t} active onClick={() => setTags(tags.filter((x) => x !== t))}>
                {t} ×
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="field flex-1"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag category"
            />
            <Button variant="secondary" onClick={addTag}><Plus size={16} />Add</Button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => setFollowUp(!followUp)} className="chip flex-1 justify-center" data-active={followUp || undefined}>
            Reach out later
          </button>
          <button type="button" onClick={() => setPrayFor(!prayFor)} className="chip flex-1 justify-center" data-active={prayFor || undefined}>
            Pray for them
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="ghost" fullWidth onClick={() => navigate(-1)}><X size={16} />Cancel</Button>
          <Button fullWidth onClick={save}>Save changes</Button>
        </div>
      </div>
    </PageTransition>
  );
}