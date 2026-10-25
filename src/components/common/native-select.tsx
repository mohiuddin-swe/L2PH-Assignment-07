import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// A plain styled <select>. It works directly with react-hook-form's register() and is fully
// keyboard and screen reader accessible, which makes it a good fit for form fields.
export function NativeSelect({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
