"use client";

import { type FC, useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Home,
  Tag,
  Heart,
  HelpCircle,
} from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const Header: FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { cart } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full px-4 py-3 bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-1.5 rounded-full hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">🧢</span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 text-transparent bg-clip-text">
              InduStyle
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Inicio
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Categorías
          </Link>
          <Link
            href="/offers"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Ofertas
          </Link>
          <Link
            href="/new"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Novedades
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block relative w-full max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar productos"}
          >
            <Search size={20} />
          </button>

          {/* User Profile */}
          <Link
            href="/account"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
            aria-label="Mi cuenta"
          >
            <User size={20} />
          </Link>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex"
            aria-label="Mis favoritos"
          >
            <Heart size={20} />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Ver carrito de compras"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden w-full pt-3 pb-2 px-2 border-t mt-3 animate-fadeDown">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Cerrar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={20} className="text-indigo-600" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Tag size={20} className="text-indigo-600" />
              <span className="font-medium">Categorías</span>
            </Link>
            <Link
              href="/offers"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Tag size={20} className="text-indigo-600" />
              <span className="font-medium">Ofertas</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} className="text-indigo-600" />
              <span className="font-medium">Mi Cuenta</span>
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={20} className="text-indigo-600" />
              <span className="font-medium">Mis Favoritos</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle size={20} className="text-indigo-600" />
              <span className="font-medium">Ayuda</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
