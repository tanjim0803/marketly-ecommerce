"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/lib/types/store";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);

  const coverImage = product.images[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
        >
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-primary">
          {product.category}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-secondary transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground">
          By <span className="text-secondary">{product.brand}</span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
            <span className="font-heading text-base font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          <button
            type="button"
            aria-label={`Add to cart: ${product.name}`}
            onClick={() =>
              addToCart({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: coverImage.url,
                price: product.price,
                sku: product.sku,
              })
            }
            className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-heading font-bold text-secondary transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
