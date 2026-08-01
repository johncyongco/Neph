import type { ReactNode } from "react";
import { cn } from "@/lib/tw";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  caption?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, caption, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-8 py-16 text-center",
        className
      )}
    >
      {icon && <div className="text-text-muted opacity-70">{icon}</div>}
      <h3 className="text-section">{title}</h3>
      {caption && (
        <p className="editorial max-w-[320px] text-[15px]">{caption}</p>
      )}
      {action}
    </div>
  );
}