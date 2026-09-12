import { UUID } from "crypto";
import { Category } from "./category";

export interface Product {
  id: UUID;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  slug: string;
  categories: Category[];
  image_url: string;
}

export interface ProductApiResponse {
  total: number;
  page: number;
  limit: number;
  items: Product[];
}
