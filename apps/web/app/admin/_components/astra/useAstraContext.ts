"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { AstraPageContext } from "./astra-types";

export function useAstraContext(): AstraPageContext {
  const pathname = usePathname();

  const agentId = useMemo(() => {
    if (pathname.startsWith("/admin/onboarding") || pathname.startsWith("/admin/strategy")) return "strategy";
    if (pathname.startsWith("/admin/audience") || pathname.startsWith("/admin/market") || pathname.startsWith("/admin/competitors")) return "research";
    if (pathname.startsWith("/admin/problems") || pathname.startsWith("/admin/sessions")) return "discovery";
    if (pathname.startsWith("/admin/solutions")) return "solution";
    if (pathname.startsWith("/admin/projects") || pathname.startsWith("/admin/features") || pathname.startsWith("/admin/sprints")) return "engineering";
    if (pathname.startsWith("/astrolytics")) return "analytics";
    return "strategy";
  }, [pathname]);

  return { agentId, currentPage: pathname };
}
