import Link from "next/link";

interface AstrolyticsLogoProps {
  collapsed?: boolean;
}

export function AstrolyticsLogo({ collapsed = false }: AstrolyticsLogoProps) {
  return (
    <Link href="/astrolytics" className="flex items-center gap-2.5 group">
      {/* Logo mark with glow — matches Nova's gradient language */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-primary-500/20 rounded-lg blur-md group-hover:bg-primary-500/30 transition-all" />
        <div className="relative w-8 h-8 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Astro</span>
          <span className="text-white">lytics</span>
        </span>
      )}
    </Link>
  );
}
