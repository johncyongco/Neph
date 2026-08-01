import { Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/tw";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search people",
  icon: Icon = Search,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Icon
        size={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field w-full pl-13 search-field"
        style={{ borderRadius: "var(--radius-search)", paddingLeft: 48 }}
      />
    </div>
  );
}