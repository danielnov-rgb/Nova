import type { LifecyclePageData } from "../_lib/types";

export const lifecycleData: LifecyclePageData = {
  weeks: [
    { week: "Jan 6", new: 420, returning: 1850, resurrecting: 180, dormant: -310 },
    { week: "Jan 13", new: 395, returning: 1920, resurrecting: 165, dormant: -285 },
    { week: "Jan 20", new: 480, returning: 1980, resurrecting: 200, dormant: -340 },
    { week: "Jan 27", new: 360, returning: 1870, resurrecting: 150, dormant: -290 },
    { week: "Feb 3", new: 510, returning: 2100, resurrecting: 220, dormant: -370 },
    { week: "Feb 10", new: 490, returning: 2050, resurrecting: 195, dormant: -325 },
    { week: "Feb 17", new: 530, returning: 2180, resurrecting: 240, dormant: -380 },
    { week: "Feb 24", new: 475, returning: 2090, resurrecting: 210, dormant: -350 },
    { week: "Mar 3", new: 550, returning: 2250, resurrecting: 260, dormant: -395 },
    { week: "Mar 10", new: 520, returning: 2300, resurrecting: 235, dormant: -360 },
    { week: "Mar 17", new: 580, returning: 2380, resurrecting: 275, dormant: -410 },
    { week: "Mar 24", new: 540, returning: 2320, resurrecting: 250, dormant: -385 },
  ],
  metrics: [
    { label: "New Users", value: "5,850", change: 12.4 },
    { label: "Returning Users", value: "25,290", change: 8.2 },
    { label: "Resurrected Users", value: "2,580", change: 15.1 },
    { label: "Dormant Users", value: "4,200", change: -6.3 },
  ],
};
