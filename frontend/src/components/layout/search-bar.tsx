"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  return (
    <form
      className={cn(
        "flex w-full items-center rounded-md border-2 border-ring bg-white p-0.5",
        className
      )}
      onSubmit={(e) => e.preventDefault()}
      role="search"
    >
      <input
        type="search"
        placeholder="Search for products..."
        aria-label="Search for products"
        className="h-11 flex-1 rounded-sm bg-transparent px-4 text-sm text-secondary outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="flex h-10 shrink-0 items-center gap-2 rounded-sm bg-primary px-5 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
