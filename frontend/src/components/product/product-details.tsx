"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Product } from "@/lib/types/product";

interface ProductDetailsProps {
  product: Product | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function ProductDetails({
  product,
  isLoading,
  isError,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const isOutOfStock = product ? product.stock_quantity === 0 : false;

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (type === "inc" && product && quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  // 1. Loading State (Skeleton UI)
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Product Not Found State
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  // 3. Main Product Details View
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Side: Product Image View */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted/30 shadow-sm">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.title || "Product Image"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-300 hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs">
                <Badge
                  variant="secondary"
                  className="px-4 py-1 text-sm font-semibold"
                >
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            {/* Categories & Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {product.categories?.map((cat) => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.title}
              </h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stock Status Indicator */}
            <div className="flex items-center gap-2">
              {!isOutOfStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">
                    In Stock ({product.stock_quantity} units available)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Currently Unavailable
                  </span>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity Selector & Actions */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-lg border bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => handleQuantityChange("dec")}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => handleQuantityChange("inc")}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1 gap-2 font-semibold">
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 font-semibold"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}

            {/* Feature Highlights Card */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div className="text-xs">
                    <p className="font-semibold">Fast Shipping</p>
                    <p className="text-muted-foreground">
                      Standard 3-5 days delivery
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div className="text-xs">
                    <p className="font-semibold">Authentic Quality</p>
                    <p className="text-muted-foreground">
                      100% genuine product
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div className="text-xs">
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-muted-foreground">
                      7 Days return policy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
