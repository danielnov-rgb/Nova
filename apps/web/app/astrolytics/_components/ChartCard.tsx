import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, actions, children, className = "" }: ChartCardProps) {
  return (
    <div className={`group relative bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300 ${className}`}>
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />

      <div className="relative">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
          </div>
          {actions}
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
