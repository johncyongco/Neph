import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button, IconButton } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { PhotoPicker } from "@/components/person/PhotoPicker";
import { usePeopleStore } from "@/store/usePeopleStore";
import { detectPlatform, harvestProfile } from "@/services/harvest";
import { JOURNEY_TYPES, PLATFORM_META } from "@/lib/constants";
import type { HarvestResult, JourneyType, Platform } from "@/lib/types";
import { cn } from "@/lib/tw";

const AUTH_WALLED = new Set<Platform>([
  "facebook",
  "instagram",
  "tiktok",
  "threads",
  "linkedin",
  "twitter",
]);

export default function AddPersonPage() {
  const navigate = useNavigate();
  const addPerson = usePeopleStore((s) => s.addPerson);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [harvest, setHarvest] = useState<HarvestResult | null>(null);
  const [showForm, setShowForm] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [journeyType, setJourneyType] = useState<JourneyType>("friend");
  const [why, setWhy] = useState("");
  const [whereMet, setWhereMet] = useState("");
  const [dateMet, setDateMet] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [prayFor, setPrayFor] = useState(false);

  const detected = url ? detectPlatform(url) : "unknown";
  const detectedMeta = PLATFORM_META[detected];

  async function onHarvest() {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await harvestProfile(url);
      setHarvest(res);
      setShowForm(true);
      if (res.name) setName(res.name);
      if (res.username) setUsername(res.username);
      if (res.bio) setBio(res.bio);
      if (res.website) setWebsite(res.website);
      if (res.platform && res.platform !== "unknown") {
        // platform field stored on save
      }
    } finally {
      setLoading(false);
    }
  }

  function addTag() {
    const t = tagDraft.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagDraft("");
  }

  function save() {
    if (!name.trim()) return;
    const platform = harvest?.platform ?? detected ?? "unknown";
    const id = addPerson({
      name: name.trim(),
      username: username || undefined,
      avatar: avatar || harvest?.avatar || undefined,
      bio: bio || undefined,
      platform,
      profileUrl: url || harvest?.profileUrl || undefined,
      website: website || harvest?.website || undefined,
      recentLinks: harvest?.recentLinks ?? [],
      journeyType,
      whyTheyMatter: why || undefined,
      whereMet: whereMet || undefined,
      dateMet: dateMet || undefined,
      tags,
      prayerIntentions: [],
      timeline: dateMet
        ? [{ id: "e-init", title: `Met ${name.trim()}`, date: dateMet, kind: "met" }]
        : [],
      photos: [],
      followUp,
      prayFor,
    });
    navigate(`/people/${id}`);
  }

  return (
    <PageTransition>
      <header className="flex items-center justify-between pt-8 pb-4">
        <IconButton label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} strokeWidth={1.8} />
        </IconButton>
        <span className="label">Remember someone</span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-page max-w-[16ch]">Whose name comes to mind first?</p>
          <p className="caption">
            Paste a profile link, or skip it and write the name from memory.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              className="field flex-1"
              placeholder="Profile URL — or leave blank"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              onClick={onHarvest}
              disabled={loading || !url.trim()}
              variant="secondary"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} strokeWidth={1.8} />
              )}
              Detect
            </Button>
          </div>
          {url && detected !== "unknown" && (
            <span className="caption">
              Detected: <span className="text-text">{detectedMeta.label}</span>
              {harvest?.manual &&
                (AUTH_WALLED.has(detected)
                  ? ` · ${detectedMeta.label} hides profiles, so add them from memory`
                  : " · couldn't fetch details — fill them in from memory")}
            </span>
          )}
        </div>

        <div className="divider" />

        {!showForm && (
          <Button variant="ghost" onClick={() => setShowForm(true)} className="self-start">
            Or write from memory
          </Button>
        )}

        {showForm && (
          <div className="flex flex-col gap-5 anim-fade">
            <div className="flex flex-col gap-1">
            <span className="label">Preview</span>
            <span className="font-heading text-[20px] text-text">
              {name || "Their name"}
            </span>
            <span className="caption">{PLATFORM_META[harvest?.platform ?? detected].label}</span>
          </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Their name"
              />
              <Input
                label="Handle / username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@handle"
              />
              <PhotoPicker
                value={avatar || undefined}
                name={name}
                onChange={(v) => setAvatar(v ?? "")}
              />
              <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A line about them"
              />
              <Input
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="their site"
              />
              <Select
                label="Journey type"
                value={journeyType}
                onChange={(e) => setJourneyType(e.target.value as JourneyType)}
              >
                {JOURNEY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Why they matter"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="The quiet reason you remember them"
              />
              <div className="flex gap-3">
                <Input
                  label="Where you met"
                  value={whereMet}
                  onChange={(e) => setWhereMet(e.target.value)}
                  placeholder="A place"
                />
                <Input
                  label="When"
                  type="date"
                  value={dateMet}
                  onChange={(e) => setDateMet(e.target.value)}
                />
              </div>

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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag category, press enter"
                  />
                  <Button variant="secondary" size="md" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFollowUp(!followUp)}
                  className={cn("chip flex-1 justify-center", followUp && "[data-active=true]")}
                  data-active={followUp || undefined}
                >
                  Reach out later
                </button>
                <button
                  type="button"
                  onClick={() => setPrayFor(!prayFor)}
                  className="chip flex-1 justify-center"
                  data-active={prayFor || undefined}
                >
                  Pray for them
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()} className="flex-[2]">
                Save to journey
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}