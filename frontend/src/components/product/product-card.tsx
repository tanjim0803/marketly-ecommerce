import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
        >
          <Image
            src={product.image_url}
            alt={product.title || "Product Image"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-primary">
          {product.categories?.map((cat) => cat.name).join(", ")}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-secondary transition-colors hover:text-primary">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-base font-bold text-primary">
              {product.price}
            </span>
          </div>

          <button
            type="button"
            className="cursor-pointer flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-heading font-bold text-secondary transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
