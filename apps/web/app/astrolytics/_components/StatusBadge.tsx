const styles = {
  active: "bg-green-400/10 text-green-400 border-green-400/20",
  running: "bg-green-400/10 text-green-400 border-green-400/20",
  paused: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  draft: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  completed: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  inactive: "bg-gray-400/10 text-gray-400 border-gray-400/20",
} as const;

interface StatusBadgeProps {
  status: keyof typeof styles;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
