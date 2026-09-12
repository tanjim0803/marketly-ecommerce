import { Category } from "@/lib/types/category";
import { categoryApi } from "@/redux/services/categoryApi";
import { makeStore } from "@/redux/store";
import Link from "next/link";

export default async function FooterCategories() {
  const store = makeStore();

  let categories: Category[] = [];
  let isError = false;

  try {
    const categoriesApi = await store.dispatch(
      categoryApi.endpoints.getCategories.initiate(),
    );

    if (categoriesApi.isError || !categoriesApi.data) {
      isError = true;
    } else {
      categories = categoriesApi.data;
    }
  } catch (err) {
    isError = true;
  }

  return (
    <>
      <h4 className="mb-4 font-heading text-sm font-bold text-secondary">
        Categories
      </h4>

      {/* Error State */}
      {isError ? (
        <p className="text-xs text-destructive">Failed to load categories.</p>
      ) : categories.length === 0 ? (
        /* Empty State */
        <p className="text-xs text-muted-foreground">No categories found.</p>
      ) : (
        /* Success State */
        <ul className="space-y-2 text-sm text-muted-foreground">
          {categories.slice(0, 5).map((category) => (
            <li key={category.id}>
              <Link
                href={`/?category=${encodeURIComponent(category.slug)}`}
                className="transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
