"use client";

import Image from "next/image";
import { useState } from "react";
import { products } from "./data/products";
import Header from "./components/Header";
import Link from "next/link";
import Chatbot from "./components/Chatbot";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="p-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1 rounded-full border ${
              selectedCategory === null
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border capitalize ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {cat.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block h-full"
                >
                  <div className="border p-4 rounded-xl shadow-md h-full flex flex-col">
                    <div className="relative aspect-square w-full mb-3 overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <h2 className="text-lg font-semibold hover:underline cursor-pointer line-clamp-2 h-14">
                        {product.name}
                      </h2>

                      <div>
                        <p className="mt-2 text-xl font-bold text-green-600">
                          ${product.price}
                        </p>
                        <p className="text-xs text-gray-400">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No se encontraron productos.
            </p>
          )}
        </div>
      </main>

      <Chatbot />
    </>
  );
}
