import { Suspense } from "react";
import { categoryApi } from "@/redux/services/categoryApi";
import { productApi } from "@/redux/services/productApi";
import { makeStore } from "@/redux/store";
import { ProductTabs } from "./product-tabs";
import ProductTabsSkeleton from "./product-skeleton";

interface ProductsProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams?.category || "all";

  const limit = 20;
  const page = 1;

  const store = makeStore();

  const categoriesResult = await store.dispatch(
    categoryApi.endpoints.getCategories.initiate(),
  );
  const {
    data: categories = [],
    isError: isCategoryError,
    error: categoryError,
  } = categoriesResult;

  const productsResult = await store.dispatch(
    productApi.endpoints.getProducts.initiate({
      categories: [currentCategory],
      limit,
      page,
    }),
  );

  const {
    data: apiData,
    isError: isProductError,
    error: productError,
  } = productsResult;

  let errorMessage: string | null = null;

  if (isProductError) {
    errorMessage = `Failed to load products: ${
      typeof productError === "object" &&
      productError !== null &&
      "data" in productError
        ? JSON.stringify((productError as { data: unknown }).data)
        : "Something went wrong"
    }`;
  } else if (isCategoryError) {
    errorMessage = `Failed to load categories: ${
      typeof categoryError === "object" &&
      categoryError !== null &&
      "data" in categoryError
        ? JSON.stringify((categoryError as { data: unknown }).data)
        : "Could not fetch categories"
    }`;
  }

  const items = apiData?.items || [];
  const totalPages = apiData
    ? Math.ceil(apiData.total / (apiData.limit || limit))
    : 0;

  return (
    <ProductTabs
      categories={categories}
      initialProducts={items}
      currentCategory={currentCategory}
      initialTotalPages={totalPages}
      errorMessage={errorMessage}
    />
  );
}

export function Products(props: ProductsProps) {
  return (
    <section>
      <Suspense fallback={<ProductTabsSkeleton />}>
        <ProductsContent {...props} />
      </Suspense>
    </section>
  );
}
