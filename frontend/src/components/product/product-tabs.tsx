import { ProductCard } from "@/components/product/product-card";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { NoProducts } from "./no-products";
import { LoadMore } from "./load-more-products";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ProductTabsProps {
  categories: Category[];
  initialProducts: Product[];
  currentCategory: string;
  initialTotalPages: number;
  errorMessage?: string | null;
}

export function ProductTabs({
  categories,
  initialProducts,
  currentCategory,
  initialTotalPages,
  errorMessage,
}: ProductTabsProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Products</h2>

        {!errorMessage && (
          <div className="flex flex-wrap items-center gap-6 rounded-lg p-1">
            <Link
              href="/?category=all"
              scroll={false}
              className={`text-md font-medium transition-all hover:text-primary ${
                currentCategory === "all"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              All
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.slug)}`}
                scroll={false}
                className={`text-md font-medium transition-all hover:text-primary ${
                  currentCategory === cat.slug
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {initialProducts.length === 0 && !errorMessage ? (
        <NoProducts
          description={
            currentCategory === "all"
              ? "There are no products available right now."
              : `We couldn't find any products matching your current category: ${currentCategory}. Please try other categories.`
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <LoadMore
            key={currentCategory}
            currentCategory={currentCategory}
            initialTotalPages={initialTotalPages}
          />
        </>
      )}
    </div>
  );
}
