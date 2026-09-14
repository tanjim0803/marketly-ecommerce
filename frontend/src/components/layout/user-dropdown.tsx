"use client";

import { ChevronDown, Loader2, LogOut, ShoppingBag, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Button } from "../ui/button";

export default function UserDropdown() {
  const { user, isLoading, logout } = useAuth();
  return (
    <>
      {isLoading ? (
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="hidden items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1.5 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary lg:flex"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs ring-2 ring-primary/20">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="hidden xl:inline-block text-sm font-medium text-foreground">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
            <div className="px-2 py-2 mb-1 rounded-sm bg-muted/40">
              <p className="text-xs font-semibold text-foreground truncate">
                {user.name}
              </p>
              {user.email && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
            </div>

            <DropdownMenuSeparator className="-mx-1 my-1" />

            <DropdownMenuItem className="cursor-pointer text-sm font-medium">
              <Link
                href="/account"
                className="flex items-center gap-2.5 px-2 py-2"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Profile & Orders</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer text-sm font-medium">
              <Link
                href="/cart"
                className="flex items-center justify-between px-2 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>My Cart</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="-mx-1 my-1" />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5 px-2 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary lg:flex font-medium"
        >
          <User className="size-6" />
          <span className="hidden xl:inline">Login</span>
        </Link>
      )}
    </>
  );
}
