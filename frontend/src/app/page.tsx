import { DealsSection } from "../components/home/deals-section";
import { HeroCarousel } from "../components/home/hero-carousel";
import { Products } from "../components/home/products";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="container flex flex-col gap-12 py-6 lg:py-10">
      <HeroCarousel />

      <Products searchParams={searchParams} />

      <DealsSection />
    </div>
  );
}
