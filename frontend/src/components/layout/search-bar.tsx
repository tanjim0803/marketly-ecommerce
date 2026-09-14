"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetFilters, setFilters } from "@/redux/features/productFilterSlice";
import { usePathname, useRouter } from "next/navigation";

export function SearchBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      dispatch(setFilters({ title: "" }));
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(resetFilters());
    dispatch(setFilters({ title: searchText.trim() }));

    if (pathname !== "/shop") {
      router.push("/shop");
    }
  };

  return (
    <form
      className={cn(
        "flex w-full items-center rounded-md border-2 border-ring bg-white p-0.5",
        className,
      )}
      onSubmit={handleSearch}
      role="search"
    >
      <input
        value={searchText}
        onChange={handleInputChange}
        type="search"
        placeholder="Search for products..."
        aria-label="Search for products"
        className="h-11 flex-1 rounded-sm bg-transparent px-4 text-sm text-secondary outline-none placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        className="flex h-10 shrink-0 items-center gap-2 rounded-sm bg-primary px-5 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
