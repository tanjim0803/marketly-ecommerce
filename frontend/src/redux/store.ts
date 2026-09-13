import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./services/productApi";
import { categoryApi } from "./services/categoryApi";
import productFilterReducer from "./features/productFilterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      productFilter: productFilterReducer,
      [productApi.reducerPath]: productApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        productApi.middleware,
        categoryApi.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
