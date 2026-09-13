"use client";

import ProductDetails from "@/components/product/product-details";
import RelatedProducts from "@/components/product/related-products";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/redux/services/productApi";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductBySlugQuery(slug);

  const categorySlugs = product?.categories?.map((cat) => cat.slug);

  const {
    data: relatedProducts,
    isLoading: relatedProductsLoading,
    isError: relatedProductsError,
  } = useGetProductsQuery({
    categories: categorySlugs,
    limit: 11,
    page: 1,
  });

  const relatedItems = relatedProducts?.items?.filter(
    (item) => item?.id !== product?.id,
  );

  return (
    <>
      <ProductDetails
        product={product}
        isLoading={productLoading}
        isError={productError}
      />
      <RelatedProducts
        products={relatedItems}
        isLoading={relatedProductsLoading}
        isError={relatedProductsError}
      />
    </>
  );
}
