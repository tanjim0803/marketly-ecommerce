import { Category } from "@/lib/types/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => `/api/products/category`,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
