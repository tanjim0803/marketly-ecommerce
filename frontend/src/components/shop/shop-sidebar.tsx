import { makeStore } from "@/redux/store";
import { CategoriesSidebar } from "./categories-sidebar";
import { categoryApi } from "@/redux/services/categoryApi";
import { PriceRangeFilter } from "./price-range-filter";

export default async function ShopSidebar() {
  const store = makeStore();

  const categoriesResult = await store.dispatch(
    categoryApi.endpoints.getCategories.initiate(),
  );
  const {
    data: categories = [],
    isError: isCategoryError,
    error: categoryError,
  } = categoriesResult;

  let errorMessage = null;

  if (isCategoryError) {
    errorMessage = `Failed to load categories: ${
      typeof categoryError === "object" &&
      categoryError !== null &&
      "data" in categoryError
        ? JSON.stringify((categoryError as { data: unknown }).data)
        : "Could not fetch categories"
    }`;
  }

  return (
    <div>
      <CategoriesSidebar
        categories={categories}
        isCategoryError={isCategoryError}
        errorMessage={errorMessage}
      />
      <PriceRangeFilter />
    </div>
  );
}
