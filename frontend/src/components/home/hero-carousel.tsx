"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "slide-1",
    eyebrow: "100% Organic",
    heading: ["Sign up & get", "20% off"],
    subheading: "Everyday fresh vegetables, delivered fast.",
    image: "https://picsum.photos/seed/hero-veggies/1600/700",
    cta: { label: "Shop Now", href: "/shop" },
  },
  {
    id: "slide-2",
    eyebrow: "Weekly Newsletter",
    heading: ["Fresh Vegetables", "Big Discount"],
    subheading: "Sign up for the daily newsletter",
    image: "https://picsum.photos/seed/hero-fruit/1600/700",
    cta: { label: "Subscribe", href: "#newsletter" },
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <section className="relative overflow-hidden rounded-lg bg-muted">
      <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[538px]">
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />

        <div className="container relative flex h-full flex-col items-start justify-center gap-4 py-10">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
            {slide.eyebrow}
          </span>
          <h1 className="max-w-xl font-heading text-4xl font-bold leading-tight text-secondary sm:text-5xl lg:text-6xl">
            {slide.heading[0]}
            <br />
            {slide.heading[1]}
          </h1>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            {slide.subheading}
          </p>
          <Button size="lg" asChild>
            <a href={slide.cta.href}>{slide.cta.label}</a>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "size-3.5 rounded-full border border-secondary transition-colors",
              i === active ? "bg-primary border-primary" : "bg-transparent"
            )}
          />
        ))}
      </div>
    </section>
  );
}
