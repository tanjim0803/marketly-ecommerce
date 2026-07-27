import { CategoriesSidebar } from "../components/home/categories-sidebar";
import { DealsSection } from "../components/home/deals-section";
import { HeroCarousel } from "../components/home/hero-carousel";
import { Products } from "../components/home/products";

export default function Home() {
  return (
    <div className="container flex flex-col gap-12 py-6 lg:py-10">
      <HeroCarousel />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        <CategoriesSidebar />
        <Products />
      </div>

      <DealsSection />
    </div>
  );
}
