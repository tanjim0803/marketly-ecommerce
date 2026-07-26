"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { mainNavLinks } from "@/components/layout/nav-links";
import { categories } from "@/data/categories";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-md text-secondary lg:hidden"
        >
          <Menu className="size-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85%] overflow-y-auto sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>
            <span className="font-heading text-xl font-bold text-primary">Nest</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1">
          {mainNavLinks.map((link) => (
            <SheetClose asChild key={link.label}>
              <Link
                href={link.href}
                className="rounded-md px-2 py-2.5 font-heading text-sm font-bold text-secondary transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator />

        <div>
          <h4 className="mb-2 font-heading text-sm font-bold text-secondary">
            Shop by category
          </h4>
          <nav className="flex flex-col gap-1">
            {categories.map((category) => (
              <SheetClose asChild key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden>{category.icon}</span>
                    {category.name}
                  </span>
                  <span className="text-xs">{category.productCount}</span>
                </Link>
              </SheetClose>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
