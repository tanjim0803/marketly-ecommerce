import { Product } from "@/lib/types/product";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductFilterQueryParams } from "../features/productFilter";

export interface ProductApiResponse {
  total: number;
  page: number;
  limit: number;
  items: Product[];
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    // টাইপ প্যারামিটার ঠিক করা হয়েছে: <Response, QueryArg>
    getProducts: builder.query<
      ProductApiResponse,
      ProductFilterQueryParams | void
    >({
      query: (filters = {}) => {
        const {
          categories,
          title,
          description,
          minPrice,
          maxPrice,
          limit = 20,
          page = 1,
        } = filters || {};

        const queryParams = new URLSearchParams();

        // Multiple categories support
        const validCategories = categories?.filter(
          (cat: string) => cat && cat !== "all",
        );
        if (validCategories && validCategories.length > 0) {
          validCategories.forEach((cat: string) =>
            queryParams.append("categories", cat),
          );
        }

        // Optional Search & Filter fields
        if (title?.trim()) queryParams.append("title", title.trim());
        if (description?.trim())
          queryParams.append("description", description.trim());
        if (minPrice !== undefined && String(minPrice) !== "")
          queryParams.append("min_price", minPrice.toString());
        if (maxPrice !== undefined && String(maxPrice) !== "")
          queryParams.append("max_price", maxPrice.toString());

        // Pagination
        queryParams.append("limit", limit.toString());
        queryParams.append("page", page.toString());

        return `/api/products/search?${queryParams.toString()}`;
      },
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug: string) => `/api/products/${slug}`,
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery, useGetProductBySlugQuery } = productApi;
