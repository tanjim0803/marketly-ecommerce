import Link from "next/link";
import {
  AtSign,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Video,
} from "lucide-react";

import { categories } from "@/data/categories";
import { mainNavLinks } from "@/components/layout/nav-links";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Logo from "../../../public/assets/images/header/marketly-logo.webp";

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "Shopping Cart", href: "/cart" },
];

const helpLinks = [
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return Policy", href: "/returns" },
];

const socialLinks = [
  { icon: MessageCircle, href: "https://facebook.com", label: "Facebook" },
  { icon: AtSign, href: "https://twitter.com", label: "Twitter" },
  { icon: Camera, href: "https://instagram.com", label: "Instagram" },
  { icon: Video, href: "https://youtube.com", label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="border-b border-border bg-muted/60">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div>
            <h3 className="font-heading text-xl font-bold text-secondary">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-muted-foreground">
              Get the latest deals and grocery tips, straight to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <Link href="/" className="w-42 h-13 flex shrink-0 items-center">
            <Image src={Logo} alt="Marketly Logo" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Fresh groceries and everyday essentials, delivered from local
            vendors to your door.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> 2118 Thornridge Cir,
              Syracuse
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +1 800 900 122
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> support@nestmart.com
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-bold text-secondary">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {mainNavLinks.slice(0, 5).map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-bold text-secondary">
            Account
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {accountLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-bold text-secondary">
            Categories
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-bold text-secondary">
            Help
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Marketly. All rights
          reserved.
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
