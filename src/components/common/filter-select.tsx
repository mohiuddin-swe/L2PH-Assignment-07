"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  /** Current value from the URL. Empty string means "all". */
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterOption[];
  /** Label of the "no filter" option, e.g. "All statuses". */
  allLabel: string;
  className?: string;
}

const ALL = "__all__";

export function FilterSelect({ value, onChange, options, allLabel, className }: FilterSelectProps) {
  const items = [{ value: ALL, label: allLabel }, ...options];
  return (
    <Select items={items} value={value || ALL} onValueChange={(next) => onChange(!next || next === ALL ? "" : next)}>
      <SelectTrigger aria-label={allLabel} className={cn("h-9 w-full sm:w-44", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}