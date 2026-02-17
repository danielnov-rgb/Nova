interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, change, changeLabel, icon }: MetricCardProps) {
  return (
    <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900 hover:border-gray-700 transition-all duration-300">
      {/* Hover glow — from Nova report MetricsGrid */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">{label}</span>
          {icon && <span className="text-gray-500">{icon}</span>}
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg
              className={`w-4 h-4 ${change >= 0 ? "text-green-400" : "text-red-400"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {change >= 0 ? (
                <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              )}
            </svg>
            <span className={`text-sm font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(1)}%
            </span>
            {changeLabel && <span className="text-sm text-gray-500">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
