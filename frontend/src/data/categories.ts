import { Category } from "@/lib/types/store";

export const categories: Category[] = [
  { id: "cat-1", name: "Baking material", slug: "baking-material", icon: "🥖", productCount: 11 },
  { id: "cat-2", name: "Bread and Juice", slug: "bread-and-juice", icon: "🍞", productCount: 8 },
  { id: "cat-3", name: "Clothing & beauty", slug: "clothing-beauty", icon: "💄", productCount: 4 },
  { id: "cat-4", name: "Deals Of The Day", slug: "deals-of-the-day", icon: "🔥", productCount: 4 },
  { id: "cat-5", name: "Fresh Fruit", slug: "fresh-fruit", icon: "🍎", productCount: 10 },
  { id: "cat-6", name: "Fresh Seafood", slug: "fresh-seafood", icon: "🐟", productCount: 5 },
  { id: "cat-7", name: "Milks and Dairies", slug: "milks-and-dairies", icon: "🥛", productCount: 5 },
  { id: "cat-8", name: "Pet Foods & Toy", slug: "pet-foods-toy", icon: "🐾", productCount: 2 },
  { id: "cat-9", name: "Vegetables", slug: "vegetables", icon: "🥦", productCount: 6 },
  { id: "cat-10", name: "Wines & Drinks", slug: "wines-drinks", icon: "🍷", productCount: 4 },
  { id: "cat-11", name: "Uncategorized", slug: "uncategorized", icon: "📦", productCount: 15 },
];

export const productTags = [
  "Brown",
  "Coffee",
  "Cream",
  "Hodo Foods",
  "Meats",
  "Organic",
  "Snack",
  "Vegetables",
];

export const browseTabs = [
  { label: "All", value: "all" },
  { label: "Baking material", value: "baking-material" },
  { label: "Fresh Fruits", value: "fresh-fruit" },
  { label: "Milks & Dairies", value: "milks-and-dairies" },
  { label: "Meats", value: "meats" },
  { label: "Vegetables", value: "vegetables" },
];
