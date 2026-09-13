import ShopProducts from "@/components/shop/shop-products";
import ShopSidebar from "@/components/shop/shop-sidebar";

export default async function ShopPage() {
  return (
    <>
      <div className="container flex flex-col gap-12 py-6 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <ShopSidebar />
          <ShopProducts />
        </div>
      </div>
    </>
  );
}
