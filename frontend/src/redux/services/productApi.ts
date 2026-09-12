import { ProductApiResponse } from "@/lib/types/product";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductApiResponse,
      { categories?: string[]; limit?: number; page?: number }
    >({
      query: ({ categories, limit = 20, page = 1 }) => {
        const validCategories = categories?.filter(
          (cat) => cat && cat !== "all",
        );

        const queryParams = new URLSearchParams();

        if (validCategories && validCategories.length > 0) {
          validCategories.forEach((cat) =>
            queryParams.append("categories", cat),
          );
        }

        queryParams.append("limit", limit.toString());
        queryParams.append("page", page.toString());

        const url = `/api/products/?${queryParams.toString()}`;

        return url;
      },
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery } = productApi;
