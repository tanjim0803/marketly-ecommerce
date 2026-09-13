import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductFilterQueryParams {
  categories?: string[];
  title?: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
}

const initialState: ProductFilterQueryParams = {
  categories: [],
  title: "",
  description: "",
  minPrice: 0,
  maxPrice: 1000,
  limit: 20,
  page: 1,
};

const productFilterSlice = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<ProductFilterQueryParams>>,
    ) => {
      // যদি শুধুমাত্র page চেঞ্জ করা হয়, তবে আগের পেজ ১ এ রিসেট হবে না
      const isPageOnly =
        Object.keys(action.payload).length === 1 && "page" in action.payload;

      return {
        ...state,
        ...action.payload,
        page: isPageOnly ? action.payload.page : (action.payload.page ?? 1),
      };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = productFilterSlice.actions;
export default productFilterSlice.reducer;
