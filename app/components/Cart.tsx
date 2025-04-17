"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  AlertIcon,
  CloseIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "./Icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: Props) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
  } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  // Calculate subtotal, shipping, and total
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
      <div
        ref={cartRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Carrito de compras"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBagIcon size="20" />
              Tu Carrito
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar carrito"
            >
              <CloseIcon size="20" color="white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <ShoppingBagIcon size="40" />
                </div>
                <p className="text-xl font-medium mb-2">
                  Tu carrito está vacío
                </p>
                <p className="text-gray-500 mb-6">
                  Agrega algunos productos para comenzar
                </p>
                <button
                  onClick={onClose}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center p-3 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-indigo-600 font-bold">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="px-2 min-w-[2ch] text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="flex items-center justify-center gap-1 text-red-500 hover:text-red-700 transition-colors p-1"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <TrashIcon size="16" color="red" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with totals and checkout */}
          {cart.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    Envío
                    {shipping === 0 && subtotal > 0 && (
                      <span className="text-green-600 text-xs">(Gratis)</span>
                    )}
                  </span>
                  <span>
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : "Gratis"}
                  </span>
                </div>
                {shipping > 0 && subtotal > 0 && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertIcon />
                    <span>Envío gratis en compras mayores a $100</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleClearCart}
                  className="flex justify-center items-center gap-1 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <TrashIcon size="16" color="red" />
                  <span>Vaciar</span>
                </button>
                <button className="flex justify-center items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  <CreditCardIcon />
                  <span>Checkout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
