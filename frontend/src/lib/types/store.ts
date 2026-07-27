export interface ProductImage {
  url: string;
  alt: string;
}

export type ProductBadge = "sale" | "new" | "hot" | "none";

export interface ProductVariantOption {
  label: string;
  value: string;
  /** Optional swatch color for color variants */
  color?: string;
  inStock?: boolean;
}

export interface ProductVariantGroup {
  name: string;
  type: "size" | "color";
  options: ProductVariantOption[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  inventory: number;
  sku: string;
  badge: ProductBadge;
  discountPercent?: number;
  variants?: ProductVariantGroup[];
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: Record<string, string>;
  sku: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}
