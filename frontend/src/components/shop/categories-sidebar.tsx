"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Category } from "@/lib/types/category";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/redux/features/productFilterSlice";
import { AlertCircle } from "lucide-react";
import { RootState } from "@/redux/store";

interface CategoriesSidebarProp {
  categories: Category[];
  isCategoryError?: boolean;
  errorMessage?: string | null;
}

export function CategoriesSidebar({
  categories,
  isCategoryError = false,
  errorMessage,
}: CategoriesSidebarProp) {
  const dispatch = useDispatch();

  const currentCategories = useSelector(
    (state: RootState) => state.productFilter?.categories ?? [],
  );

  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    const updatedCategories = isChecked
      ? [...currentCategories, slug]
      : currentCategories.filter((cat) => cat !== slug);

    dispatch(setFilters({ categories: updatedCategories }));
  };

  return (
    <aside className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-4 border-b-2 border-primary pb-3">
          <h3 className="font-heading text-lg font-bold text-secondary">
            Category
          </h3>
        </div>

        {isCategoryError && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{errorMessage || "Failed to load categories."}</p>
          </div>
        )}

        <FieldSet>
          <FieldGroup className="gap-3">
            {categories.map((category) => {
              const fieldId = `category-${category.id}`;
              const isChecked = currentCategories.includes(category.slug);

              return (
                <Field key={category.id} orientation="horizontal">
                  <Checkbox
                    id={fieldId}
                    name="category"
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, Boolean(checked))
                    }
                  />
                  <FieldLabel
                    htmlFor={fieldId}
                    className="font-normal cursor-pointer select-none"
                  >
                    {category.name}
                  </FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
        </FieldSet>
      </Card>
    </aside>
  );
}
