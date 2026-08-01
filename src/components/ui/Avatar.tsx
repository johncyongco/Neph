import { initials } from "@/lib/format";
import { cn } from "@/lib/tw";
import type { Platform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/constants";

interface AvatarProps {
  src?: string;
  name: string;
  platform?: Platform;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, platform, size = 48, className }: AvatarProps) {
  const ring = platform ? PLATFORM_META[platform].color : undefined;
  return (
    <div
      className={cn("relative flex-shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size, boxShadow: ring ? `0 0 0 2px ${ring}30` : undefined }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-card-soft text-text-secondary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}