"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

// Types freely, then writes to the URL once the user pauses (so we do not call the API per keystroke).
export function SearchInput({ value, onChange, placeholder = "Search...", className, debounceMs = 350 }: SearchInputProps) {
  const [text, setText] = useState(value);
  const [previous, setPrevious] = useState(value);

  // Clearing from outside (for example a "Reset filters" button) also clears the box.
  if (value !== previous) {
    setPrevious(value);
    if (value === "") setText("");
  }

  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => onChange(text), debounceMs);
    return () => clearTimeout(timer);
  }, [text, value, onChange, debounceMs]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label="Clear search"
          onClick={() => {
            setText("");
            onChange("");
          }}
        >
          <X aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}