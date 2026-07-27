import Link from "next/link";
import Image from "next/image";
import { getFeaturedDeals } from "@/data/mockProducts";
import { formatPrice } from "@/lib/utils";

export function DealsSection() {
  const deals = getFeaturedDeals();

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl">Deals Of The Day</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {deals.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="line-clamp-2 font-heading text-base font-bold text-secondary group-hover:text-primary">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                By <span className="text-secondary">{product.brand}</span>
              </p>
              <div className="mt-auto flex items-baseline gap-2 pt-2">
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="font-heading text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
