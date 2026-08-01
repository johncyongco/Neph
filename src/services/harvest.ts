import type { HarvestResult, Platform, RecentLink } from "@/lib/types";

// Optional Microlink API key (free tier = 50 req/day). Set VITE_MICROLINK_KEY
// in a .env file to raise limits. Without a key the free tier still works.
const MICROLINK_KEY = import.meta.env.VITE_MICROLINK_KEY as string | undefined;

// Abort the harvest fetch after this long so "Detect" can never hang and
// leave the user unable to save — we'd rather fall back to a manual scaffold.
const HARVEST_TIMEOUT_MS = 8000;

// Brand names Microlink returns as the page <title> when a profile is hidden
// behind an auth wall — scraping produced the marketing site, not a person.
const GENERIC_BRAND_NAMES = new Set([
  "facebook",
  "instagram",
  "tiktok",
  "threads",
  "reddit",
  "x",
  "twitter",
  "youtube",
  "linkedin",
  "medium",
  "substack",
  "snapchat",
  "pinterest",
  "tumblr",
]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Junk titles look like "Threads • Log in", "Instagram", "Explore the things
// you love." — a brand name followed by separators/marketing, NOT a person.
// "x" is kept out of the pattern because it's a single letter and too greedy.
const GENERIC_BRAND_PATTERN = new RegExp(
  `^(?:${[...GENERIC_BRAND_NAMES]
    .filter((n) => n !== "x")
    .map(escapeRegExp)
    .join("|")})(?:\\s|\\b|[•·|—–])`,
  "i"
);

function isGenericBrandTitle(title: string): boolean {
  if (!title) return false;
  const t = title.toLowerCase().trim();
  return GENERIC_BRAND_NAMES.has(t) || GENERIC_BRAND_PATTERN.test(t);
}

// "NASA (@nasa) • Threads, Say more" → "NASA"; drop the platform suffix and
// the trailing handle so a real profile title becomes a person's name.
function cleanTitle(title: string): string | undefined {
  if (!title) return undefined;
  const cleaned = title
    .replace(/[•·|].*$/s, "")
    .replace(/\s*\(@[^)]*\)\s*$/s, "")
    .replace(/\bthreads\b.*$/i, "")
    .replace(/[–—-]+\s*(log\s*in|explore|sign\s*up).*$/i, "")
    .trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

export function detectPlatform(url: string): Platform {
  const u = url.trim().toLowerCase();
  if (!u) return "unknown";
  if (/youtu\.be\/|youtube\.com\//.test(u)) return "youtube";
  if (/github\.com\//.test(u)) return "github";
  if (/(^|\/|\.)(twitter\.com|x\.com)\//.test(u)) return "twitter";
  if (/instagram\.com\//.test(u)) return "instagram";
  if (/linkedin\.com\//.test(u)) return "linkedin";
  if (/facebook\.com\//.test(u)) return "facebook";
  if (/(^|\.)(threads\.net|threads\.com)\//.test(u)) return "threads";
  if (/reddit\.com\//.test(u)) return "reddit";
  if (/tiktok\.com\//.test(u)) return "tiktok";
  if (/\.rss$|\/rss\/?|\/feed\/?|\/atom\.xml/.test(u)) return "rss";
  if (/anchor\.fm|podcasts\.apple\.com|open\.spotify\.com\/show|soundcloud\.com/.test(u))
    return "podcast";
  if (/substack\.com\/|medium\.com\//.test(u)) return "blog";
  if (/^https?:\/\/.+/.test(u)) return "website";
  return "unknown";
}

export function extractUsername(url: string): string | undefined {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[0] ? decodeURIComponent(parts[0].replace("@", "")) : u.hostname;
  } catch {
    return undefined;
  }
}

interface MicrolinkResponse {
  status: "success" | "fail";
  data?: {
    title?: string;
    description?: string;
    image?: { url?: string } | null;
    logo?: { url?: string } | null;
    author?: string;
    publisher?: string;
    url?: string;
  };
}

async function viaMicrolink(url: string): Promise<Partial<HarvestResult> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HARVEST_TIMEOUT_MS);
  try {
    const endpoint = new URL("https://api.microlink.io/");
    endpoint.searchParams.set("url", url);
    if (MICROLINK_KEY) endpoint.searchParams.set("apiKey", MICROLINK_KEY);
    const res = await fetch(endpoint.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const j = (await res.json()) as MicrolinkResponse;
    if (j.status !== "success" || !j.data) return null;
    const d = j.data;

    // Reject generic site metadata — when a platform hides a profile behind
    // auth, Microlink falls back to the site's branding ("Facebook",
    // "Instagram", "Threads • Log in", …). That junk is worse than nothing,
    // so we drop it and let the caller use the manual form.
    const rawTitle = d.title || d.author || "";
    if (isGenericBrandTitle(rawTitle)) return null;

    const title = cleanTitle(rawTitle);
    const website =
      d.url && d.url !== url && !/\/(login|signup|signin)\b/i.test(d.url)
        ? d.url
        : undefined;

    return {
      name: title,
      bio: d.description || undefined,
      avatar: d.image?.url || d.logo?.url || undefined,
      website,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function harvestProfile(
  url: string,
  _settings?: { youtubeKey?: string; githubToken?: string }
): Promise<HarvestResult> {
  const platform = detectPlatform(url);
  const username = extractUsername(url);

  // GitHub — open REST API, CORS-allowed, gives the richest profile data.
  if (platform === "github") {
    try {
      const res = await fetch(`https://api.github.com/users/${username ?? ""}`, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (res.ok) {
        const d = (await res.json()) as {
          name?: string;
          avatar_url?: string;
          bio?: string;
          blog?: string;
          html_url?: string;
        };
        return {
          platform,
          username,
          name: d.name,
          avatar: d.avatar_url,
          bio: d.bio,
          website: d.blog || undefined,
          profileUrl: d.html_url,
          recentLinks: [],
          manual: false,
        };
      }
    } catch {
      /* fall through */
    }
  }

  // Everything else — Microlink (Open Graph + per-platform rules, runs
  // server-side so it sidesteps CORS/auth blocks on Instagram, TikTok, X,
  // YouTube, Reddit, Threads, LinkedIn, Facebook). Free 50 req/day.
  if (platform !== "unknown") {
    const meta = await viaMicrolink(url);
    if (meta && (meta.name || meta.bio || meta.avatar)) {
      return {
        platform,
        username,
        profileUrl: url,
        recentLinks: [] as RecentLink[],
        manual: false,
        ...meta,
      };
    }
  }

  // Final fallback — a manual scaffold so the user fills in the rest
  // (and a chosen photo) from memory.
  return {
    platform,
    username,
    name: username,
    profileUrl: url,
    recentLinks: [] as RecentLink[],
    manual: true,
  };
}