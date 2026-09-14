"use client";

import { ProductCard } from "@/components/product/product-card";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { NoProducts } from "../product/no-products";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetProductsQuery } from "@/redux/services/productApi";
import { Product } from "@/lib/types/product";
import ProductTabsSkeleton from "../product/product-skeleton";
import { setFilters } from "@/redux/features/productFilterSlice";
import { Button } from "@/components/ui/button";

export default function ShopProducts() {
  const dispatch = useDispatch();

  const filters = useSelector((state: RootState) => state.productFilter);

  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetProductsQuery(filters);

  const products: Product[] = apiData?.items || [];
  const totalItems = apiData?.total || 0;
  const currentPage = filters.page || 1;
  const limit = filters.limit || 20;

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setFilters({ page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  let errorMessage: string | null = null;
  if (isError && error) {
    errorMessage =
      "data" in error
        ? JSON.stringify((error as { data: unknown }).data)
        : "Failed to load products. Please try again later.";
  }

  return (
    <div className="relative min-h-[400px] flex flex-col justify-between">
      <div>
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <ProductTabsSkeleton />
          </div>
        ) : products.length === 0 && !errorMessage ? (
          <NoProducts description="There are no products available matching your criteria." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing Page{" "}
            <span className="font-semibold text-foreground">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1,
                )
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(page)}
                        disabled={isFetching}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isFetching}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
