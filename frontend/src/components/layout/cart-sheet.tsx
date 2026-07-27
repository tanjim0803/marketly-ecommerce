"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
  const cartItems = useCartStore((s) => s.cartItems);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const cartCount = useCartStore((s) => s.cartCount());

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open cart"
          className="relative flex h-9 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="relative">
            <ShoppingCart className="size-6" />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              {cartCount}
            </span>
          </span>
          <span className="hidden xl:inline">Cart</span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <ShoppingCart className="size-10" />
            <p>Your cart is empty.</p>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={() => setCartOpen(false)}>
                Continue shopping
              </Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.sku}`} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-1 text-sm font-semibold text-secondary hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex size-6 items-center justify-center rounded border border-border hover:bg-muted"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-4 text-center text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex size-6 items-center justify-center rounded border border-border hover:bg-muted"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between font-heading text-base font-bold text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/cart">View cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
