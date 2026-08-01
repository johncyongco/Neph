export function StatCard({
  value,
  label,
  color = "var(--text)",
  onClick,
}: {
  value: number | string;
  label: string;
  color?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="group flex flex-col items-start gap-1 rounded-[18px] p-5 text-left transition-colors disabled:cursor-default enabled:hover:bg-card-soft/60"
    >
      <span
        className="font-heading text-[40px] leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span className="label">{label}</span>
    </button>
  );
}