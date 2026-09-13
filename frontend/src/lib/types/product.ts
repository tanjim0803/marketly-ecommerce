import { Category } from "./category";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  slug: string;
  categories: Category[];
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProductApiResponse {
  total: number;
  page: number;
  limit: number;
  items: Product[];
}
