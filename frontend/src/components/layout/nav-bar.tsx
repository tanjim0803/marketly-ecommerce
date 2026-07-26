"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { mainNavLinks } from "@/components/layout/nav-links";

export function NavBar() {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="hidden border-y border-border bg-white lg:block">
      <div className="container relative flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button
              type="button"
              className="flex h-[50px] items-center gap-2.5 rounded-md bg-primary px-6 font-heading text-sm font-bold text-white"
            >
              <Menu className="size-4" />
              Browse All Categories
              <ChevronDown className="size-3" />
            </button>

            {showCategories && (
              <div className="absolute left-0 top-full z-40 w-72 rounded-md border border-border bg-white py-2 shadow-lg">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden>{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="text-xs">{category.productCount}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-[70px] items-center px-4 font-heading text-sm font-bold text-secondary transition-colors hover:text-primary",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Phone className="size-8 text-primary" />
          <div className="leading-tight">
            <p className="font-heading text-xl font-bold text-primary">
              1900 888 123
            </p>
            <p className="text-xs text-muted-foreground">24/7 Support Center</p>
          </div>
        </div>
      </div>
    </div>
  );
}
