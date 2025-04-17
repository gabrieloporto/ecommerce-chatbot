import { products } from "@/app/data/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetailt";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}
