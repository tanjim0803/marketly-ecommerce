"use client";

import { browseTabs } from "@/data/categories";
import { getProducts } from "@/data/mockProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/product-card";

export function Products() {
  return (
    <section>
      <Tabs defaultValue="all">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl">Products</h2>

          <TabsList className="flex-wrap">
            {browseTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {browseTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {getProducts(tab.value).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
