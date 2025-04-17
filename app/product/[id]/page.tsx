"use client";

import { products } from "@/app/data/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import Header from "@/app/components/Header";
import Link from "next/link";
import {
  BackIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/app/components/Icons";

interface Props {
  params: { id: string };
}

export default function ProductDetail({ params }: Props) {
  const product = products.find((p) => p.id === parseInt(params.id));
  const { cart, decreaseQuantity, increaseQuantity, removeFromCart } =
    useCart();

  const { addToCart } = useCart();

  if (!product) return notFound();

  const itemInCart = cart.find((item) => item.id === product.id);

  return (
    <>
      <Header />

      <div className="p-6 max-w-3xl mx-auto">
        <Link
          href="/"
          className="my-2 flex gap-2 font-bold items-center justify-left"
        >
          <BackIcon />
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-green-600 font-semibold text-xl mb-2">
              ${product.price}
            </p>
            <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
            {itemInCart ? (
              <>
                <div className="flex items-center justify-left gap-2 mt-2">
                  <button
                    className="p-1 bg-gray-200 rounded"
                    onClick={() => decreaseQuantity(product.id)}
                  >
                    <MinusIcon />
                  </button>
                  <span className="min-w-[2ch] text-lg text-center font-bold">
                    {itemInCart.quantity}
                  </span>
                  <button
                    className="p-1 bg-gray-200 rounded"
                    onClick={() => increaseQuantity(product.id)}
                  >
                    <PlusIcon />
                  </button>
                </div>

                <button
                  className="mt-2 py-2 px-4 bg-red-500 text-white flex items-center gap-2 rounded-md"
                  onClick={() => removeFromCart(product.id)}
                >
                  <TrashIcon color="white" size="24" /> Eliminar
                </button>
              </>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="mt-2 px-4 py-2 bg-black text-white rounded-md"
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
