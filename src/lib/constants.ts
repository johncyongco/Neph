import type { JourneyType, Platform } from "./types";

export const STORAGE_KEY = "neph_people_v3";
export const SETTINGS_KEY = "neph_settings_v2";
export const APP_NAME = "Neph";
export const APP_TAGLINE = "a journey book of people";

export const PAYWALL_NOTE =
  "Neph remembers people gently. There is nothing to collect here, only someone to recall.";

export const JOURNEY_TYPES: { id: JourneyType; label: string; color: string }[] = [
  { id: "mentor", label: "Mentor", color: "#788567" },
  { id: "friend", label: "Friend", color: "#8AA8BD" },
  { id: "inspiration", label: "Inspiration", color: "#CFB06D" },
  { id: "missionary", label: "Missionary", color: "#788567" },
  { id: "collaborator", label: "Collaborator", color: "#8AA8BD" },
  { id: "prayer", label: "Someone I pray for", color: "#C88A6C" },
  { id: "hope-to-meet", label: "Hope to meet", color: "#CFB06D" },
  { id: "changed-life", label: "Changed my life", color: "#C88A6C" },
  { id: "family", label: "Family", color: "#788567" },
  { id: "other", label: "Other", color: "#A39C92" },
];

export const PLATFORM_META: Record<
  Platform,
  { label: string; color: string; host: string }
> = {
  youtube: { label: "YouTube", color: "#C4302B", host: "youtube.com" },
  github: { label: "GitHub", color: "#2E2A26", host: "github.com" },
  twitter: { label: "X", color: "#2E2A26", host: "twitter.com" },
  instagram: { label: "Instagram", color: "#C88A6C", host: "instagram.com" },
  linkedin: { label: "LinkedIn", color: "#8AA8BD", host: "linkedin.com" },
  facebook: { label: "Facebook", color: "#8AA8BD", host: "facebook.com" },
  threads: { label: "Threads", color: "#2E2A26", host: "threads.net" },
  reddit: { label: "Reddit", color: "#CFB06D", host: "reddit.com" },
  tiktok: { label: "TikTok", color: "#2E2A26", host: "tiktok.com" },
  website: { label: "Website", color: "#788567", host: "" },
  blog: { label: "Blog", color: "#CFB06D", host: "" },
  rss: { label: "RSS", color: "#CFB06D", host: "" },
  podcast: { label: "Podcast", color: "#C88A6C", host: "" },
  unknown: { label: "Manual", color: "#A39C92", host: "" },
};

export const PLATFORM_ORDER: Platform[] = [
  "youtube",
  "github",
  "twitter",
  "instagram",
  "linkedin",
  "facebook",
  "threads",
  "reddit",
  "tiktok",
  "website",
  "blog",
  "rss",
  "podcast",
];