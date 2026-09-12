"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/types/product";
import { ProductCard } from "@/components/product/product-card";
import { useLazyGetProductsQuery } from "@/redux/services/productApi";

interface LoadMoreProps {
  currentCategory: string;
  initialTotalPages: number;
}

export function LoadMore({
  currentCategory,
  initialTotalPages,
}: LoadMoreProps) {
  const [page, setPage] = useState<number>(1);
  const [extraProducts, setExtraProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);

  // RTK Query Lazy Trigger Hook
  const [trigger, { isFetching }] = useLazyGetProductsQuery();

  const limit = 20;

  const handleLoadMore = async () => {
    if (isFetching || page >= totalPages) return;

    const nextPage = page + 1;

    try {
      const res = await trigger({
        categories: [currentCategory],
        limit,
        page: nextPage,
      }).unwrap();

      if (res?.items) {
        setExtraProducts((prev) => [...prev, ...res.items]);
        setPage(nextPage);
        setTotalPages(Math.ceil(res.total / (res.limit || limit)));
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    }
  };

  return (
    <>
      {/* নতুন লোড হওয়া প্রোডাক্টগুলো গ্রিডে রেন্ডার হবে */}
      {extraProducts.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {extraProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {page < totalPages && (
        <div className="mt-10 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            size="lg"
            className="min-w-[160px] font-medium"
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
