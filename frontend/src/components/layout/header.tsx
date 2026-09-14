import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/assets/images/header/marketly-logo.webp";
import { SearchBar } from "@/components/layout/search-bar";
import { NavBar } from "@/components/layout/nav-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import CartSheet from "@/components/layout/cart-sheet";

import UserDropdown from "./user-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background">
      <div className="border-b border-border bg-white">
        <div className="container flex items-center gap-4 py-4 lg:gap-10 lg:py-5">
          <MobileNav />

          <Link href="/" className="w-42 h-13 flex shrink-0 items-center gap-2">
            <Image src={Logo} alt="Marketly Logo" priority />
          </Link>

          <div className="hidden flex-1 md:flex justify-center">
            <SearchBar className="max-w-150" />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-6">
            <CartSheet />

            <UserDropdown />
          </div>
        </div>
        <div className="container pb-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      <NavBar />
    </header>
  );
}
