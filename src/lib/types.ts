export type Platform =
  | "youtube"
  | "github"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "facebook"
  | "threads"
  | "reddit"
  | "tiktok"
  | "website"
  | "blog"
  | "rss"
  | "podcast"
  | "unknown";

export type JourneyType =
  | "mentor"
  | "friend"
  | "inspiration"
  | "missionary"
  | "collaborator"
  | "prayer"
  | "hope-to-meet"
  | "changed-life"
  | "family"
  | "other";

export interface RecentLink {
  title: string;
  url: string;
  date?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  note?: string;
  date: string;
  kind?: "met" | "memory" | "milestone" | "note" | "photo";
  tags?: string[];
}

export interface PrayerIntention {
  id: string;
  text: string;
  date: string;
}

export interface Person {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  platform: Platform;
  profileUrl?: string;
  website?: string;
  recentLinks: RecentLink[];
  journeyType: JourneyType;
  whyTheyMatter?: string;
  whereMet?: string;
  dateMet?: string;
  yearsKnown?: number;
  birthday?: string;
  lastInteraction?: string;
  prayerIntentions: PrayerIntention[];
  notes?: string;
  tags: string[];
  timeline: TimelineEvent[];
  photos: string[];
  followUp: boolean;
  prayFor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HarvestResult {
  platform: Platform;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  profileUrl?: string;
  recentLinks: RecentLink[];
  manual: boolean;
}