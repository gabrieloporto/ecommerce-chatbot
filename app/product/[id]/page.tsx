import { products } from "@/app/data/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetailt";

export default function Page({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}
