"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, Eye } from "lucide-react";

interface RelatedProductsProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="container my-16 sm:my-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Related Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            You might also like these products from the same category
          </p>
        </div>
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link href="/shop">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((item) => {
          const isOutOfStock = item.stock_quantity === 0;

          return (
            <Card
              key={item.id}
              className="group overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {isOutOfStock ? (
                    <Badge
                      variant="default"
                      className="text-[10px] font-semibold"
                    >
                      Out of Stock
                    </Badge>
                  ) : (
                    item.categories?.[0] && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-background/80 backdrop-blur-xs"
                      >
                        {item.categories[0].name}
                      </Badge>
                    )
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs shadow-xs hover:bg-background"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Add to Wishlist</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    asChild
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs shadow-xs hover:bg-background"
                  >
                    <Link href={`/products/${item.slug}`}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">View Details</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors text-base">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${item.price?.toFixed(2)}
                  </span>
                  {item.stock_quantity > 0 && item.stock_quantity <= 5 && (
                    <span className="text-[11px] text-amber-600 font-medium">
                      Only {item.stock_quantity} left
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  disabled={isOutOfStock}
                  className="w-full gap-2 font-medium"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
