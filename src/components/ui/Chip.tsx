import type { ReactNode } from "react";
import { cn } from "@/lib/tw";

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
  className?: string;
}

export function Chip({ children, active, onClick, color, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : undefined}
      className={cn("chip", className)}
      style={active && color ? { background: color, borderColor: color, color: "#FFFCF8" } : undefined}
    >
      {children}
    </button>
  );
}