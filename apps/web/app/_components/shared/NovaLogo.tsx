import Link from "next/link";

interface NovaLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function NovaLogo({ size = "md", showTagline = false, className = "" }: NovaLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <span className={`${sizeClasses[size]} font-bold`}>
          <span className="font-black bg-gradient-to-br from-primary-400 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-primary-500 transition-all">
            N
          </span>
          <span className="text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            ova
          </span>
        </span>
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>
      {showTagline && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          Product Intelligence
        </span>
      )}
    </Link>
  );
}
