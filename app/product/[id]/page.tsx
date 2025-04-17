import { products } from "@/app/data/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import { Metadata } from "next";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default function Page({ params }: PageProps) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  return <ProductDetail product={product} />;
}
