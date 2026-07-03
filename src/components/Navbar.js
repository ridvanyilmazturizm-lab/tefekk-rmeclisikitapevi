"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { setIsCartOpen, getCartCount, isMounted } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#2a2a35] py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex flex-col">
        <span className="text-lg md:text-xl font-bold tracking-widest font-serif text-[#d4af37] hover:opacity-90 transition-opacity">
          TEFEKKÜR MECLİSİ
        </span>
        <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-[#f3f4f6]/80 text-center">
          KİTAP EVİ
        </span>
      </Link>

      {/* Navigation Links - Desktop */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider">
        <Link
          href="/"
          className="text-[#f3f4f6] hover:text-[#d4af37] transition-colors"
        >
          ANASAYFA
        </Link>
        <Link
          href="/books"
          className="text-[#f3f4f6] hover:text-[#d4af37] transition-colors"
        >
          TÜM KİTAPLAR
        </Link>
        <Link
          href="/books?category=Manevi+Seyahat+%26+Siyer"
          className="text-[#d4af37] hover:text-[#f3e5ab] transition-colors flex items-center gap-1 font-semibold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          MANEVİ SEYAHAT & SİYER
        </Link>
        <Link
          href="/admin"
          className="text-[#f3f4f6] hover:text-[#d4af37] transition-colors"
        >
          ADMİN PANELİ
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-gray-300 hover:text-[#d4af37] transition-all bg-[#18181f] rounded-full border border-[#2a2a35] hover:border-[#d4af37]/50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {isMounted && getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-[#0a0a0c] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {getCartCount()}
            </span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-[#d4af37] transition-colors bg-[#18181f] rounded border border-[#2a2a35]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-[#121216] border-b border-[#2a2a35] py-4 px-6 flex flex-col space-y-4 md:hidden shadow-xl">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#f3f4f6] hover:text-[#d4af37] font-medium tracking-wide"
          >
            ANASAYFA
          </Link>
          <Link
            href="/books"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#f3f4f6] hover:text-[#d4af37] font-medium tracking-wide"
          >
            TÜM KİTAPLAR
          </Link>
          <Link
            href="/books?category=Manevi+Seyahat+%26+Siyer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#d4af37] hover:text-[#f3e5ab] font-medium tracking-wide flex items-center gap-1"
          >
            MANEVİ SEYAHAT & SİYER
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#f3f4f6] hover:text-[#d4af37] font-medium tracking-wide"
          >
            ADMİN PANELİ
          </Link>
        </div>
      )}
    </nav>
  );
}
