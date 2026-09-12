"use client";

import { PackageSearch } from "lucide-react";

interface NoProductsProps {
  title?: string;
  description?: string;
}

export function NoProducts({
  title = "No products found",
  description = "We couldn't find any products matching your current filters or search terms.",
}: NoProductsProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center animate-in fade-in-50">
      <div className="bg-accent text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <PackageSearch className="h-8 w-8 stroke-[1.5]" />
      </div>

      <h3 className="text-secondary text-xl font-bold tracking-tight">
        {title}
      </h3>

      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
