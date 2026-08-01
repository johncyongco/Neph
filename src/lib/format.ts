export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function formatDateLong(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function yearOf(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return String(d.getFullYear());
}

export function timeAgo(iso?: string): string {
  if (!iso) return "a while ago";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "a while ago";
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function upcomingInDays(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.ceil((thisYear.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86_400_000);
  if (diffDays < 0) {
    const nextYear = new Date(now.getFullYear() + 1, d.getMonth(), d.getDate());
    return Math.ceil((nextYear.getTime() - now.getTime()) / 86_400_000);
  }
  return diffDays;
}

export function journeyYearsFor(dateMet?: string, eventDates: string[] = []): number {
  const years: number[] = [];
  if (dateMet) {
    const y = new Date(dateMet).getFullYear();
    if (Number.isFinite(y) && y > 1900) years.push(y);
  }
  for (const d of eventDates) {
    const y = new Date(d).getFullYear();
    if (Number.isFinite(y) && y > 1900) years.push(y);
  }
  if (years.length === 0) return 0;
  return Math.max(0, new Date().getFullYear() - Math.min(...years));
}