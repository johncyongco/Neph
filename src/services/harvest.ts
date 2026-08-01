import type { HarvestResult, Platform, RecentLink } from "@/lib/types";

// Optional Microlink API key (free tier = 50 req/day). Set VITE_MICROLINK_KEY
// in a .env file to raise limits. Without a key the free tier still works.
const MICROLINK_KEY = import.meta.env.VITE_MICROLINK_KEY as string | undefined;

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

function extractUsername(url: string): string | undefined {
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
  try {
    const endpoint = new URL("https://api.microlink.io/");
    endpoint.searchParams.set("url", url);
    if (MICROLINK_KEY) endpoint.searchParams.set("apiKey", MICROLINK_KEY);
    const res = await fetch(endpoint.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as MicrolinkResponse;
    if (j.status !== "success" || !j.data) return null;
    const d = j.data;

    // Reject generic site metadata — when a platform hides a profile behind
    // auth, Microlink falls back to the site's branding ("Facebook",
    // "Instagram", …, "Explore the things you love."). That junk is worse
    // than nothing, so we drop it and let the caller use the manual form.
    const title = (d.title || "").trim().toLowerCase();
    const isGenericBrand =
      title !== "" && GENERIC_BRAND_NAMES.has(title);
    const website =
      d.url && d.url !== url && !/\/(login|signup|signin)\b/i.test(d.url)
        ? d.url
        : undefined;

    if (isGenericBrand) return null;

    return {
      name: d.title || d.author || undefined,
      bio: d.description || undefined,
      avatar: d.image?.url || d.logo?.url || undefined,
      website,
    };
  } catch {
    return null;
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