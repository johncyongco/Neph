import type { ReactNode } from "react";
import { cn } from "@/lib/tw";

interface SectionHeaderProps {
  title: string;
  caption?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, caption, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex flex-col">
        <h2 className="text-section">{title}</h2>
        {caption && <p className="caption mt-1">{caption}</p>}
      </div>
      {action}
    </div>
  );
}