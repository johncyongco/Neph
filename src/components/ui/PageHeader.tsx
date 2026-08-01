import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4 pt-10 pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-page">{title}</h1>
        {subtitle && <p className="caption">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}