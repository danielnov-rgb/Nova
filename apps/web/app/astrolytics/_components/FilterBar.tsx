import type { ReactNode } from "react";
import { DateRangePicker } from "./DateRangePicker";

interface FilterBarProps {
  children?: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      <div className="flex items-center gap-3 flex-wrap">{children}</div>
      <DateRangePicker />
    </div>
  );
}
