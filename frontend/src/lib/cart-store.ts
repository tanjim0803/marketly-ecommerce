"use client";

import { create } from "zustand";
import { CartItem } from "./types/store";

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
}

function variantKeyOf(item: Pick<CartItem, "productId" | "variant">) {
  return `${item.productId}:${JSON.stringify(item.variant ?? {})}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  addToCart: (item, quantity = 1) =>
    set((state) => {
      const key = variantKeyOf(item);
      const existing = state.cartItems.find((i) => variantKeyOf(i) === key);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            variantKeyOf(i) === key ? { ...i, quantity: i.quantity + quantity } : i
          ),
          isCartOpen: true,
        };
      }
      return {
        cartItems: [...state.cartItems, { ...item, quantity }],
        isCartOpen: true,
      };
    }),
  removeFromCart: (productId, variantKey) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (i) => !(i.productId === productId && (!variantKey || variantKeyOf(i) === variantKey))
      ),
    })),
  updateQuantity: (productId, quantity, variantKey) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((i) =>
          i.productId === productId && (!variantKey || variantKeyOf(i) === variantKey)
            ? { ...i, quantity: Math.max(0, quantity) }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),
  clearCart: () => set({ cartItems: [] }),
  cartCount: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
  cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0),
}));
