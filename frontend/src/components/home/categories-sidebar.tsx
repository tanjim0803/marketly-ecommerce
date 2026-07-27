import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { categories, productTags } from "@/data/categories";
import { Card } from "@/components/ui/card";

export function CategoriesSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-4 border-b-2 border-primary pb-3">
          <h3 className="font-heading text-lg font-bold text-secondary">Category</h3>
        </div>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden className="text-lg leading-none">
                    {category.icon}
                  </span>
                  {category.name}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  {category.productCount}
                  <ChevronRight className="size-3" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="mb-4 border-b-2 border-primary pb-3">
          <h3 className="font-heading text-lg font-bold text-secondary">Product Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {productTags.map((tag) => (
            <Link
              key={tag}
              href={`/shop?tag=${tag.toLowerCase()}`}
              className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {tag}
            </Link>
          ))}
        </div>
      </Card>
    </aside>
  );
}
