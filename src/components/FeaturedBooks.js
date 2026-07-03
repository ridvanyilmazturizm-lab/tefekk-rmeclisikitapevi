"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function FeaturedBooks({ books }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.slice(0, 3).map((book) => (
        <div
          key={book.id}
          className="glass-card-gold gold-glow-hover p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
        >
          {/* Card Body */}
          <div>
            {/* Book Cover Image Container */}
            <div className="w-full h-64 bg-[#202028] rounded-lg border border-[#2a2a35] overflow-hidden flex items-center justify-center mb-5 relative">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="text-xl font-bold text-gray-500 font-serif">KİTAP</span>
              )}
              {/* Category Badge */}
              <span className="absolute top-3 left-3 bg-[#0a0a0c]/85 text-[#d4af37] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded border border-[#d4af37]/30 backdrop-blur-sm">
                {book.category}
              </span>
            </div>

            {/* Title & Author */}
            <div className="space-y-1">
              <Link href={`/books/${book.id}`} className="block">
                <h3 className="text-lg font-bold font-serif text-[#f3f4f6] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-400 font-medium">{book.author}</p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center space-x-1 mt-2 text-xs text-yellow-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <svg
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < Math.floor(book.rating || 5)
                      ? "fill-current"
                      : "stroke-current fill-none"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.783-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"
                  />
                </svg>
              ))}
              <span className="text-gray-400 font-medium ml-1">
                ({book.rating?.toFixed(1) || "5.0"})
              </span>
            </div>

            {/* Description Short snippet */}
            <p className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Pricing and Actions */}
          <div className="mt-6 pt-4 border-t border-[#2a2a35] flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Fiyat</span>
              <span className="text-xl font-bold font-serif text-[#d4af37]">
                {book.price.toFixed(2)} TL
              </span>
            </div>

            {book.stock > 0 ? (
              <button
                onClick={() => addToCart(book, 1)}
                className="px-4 py-2 bg-[#18181f] text-[#d4af37] text-xs font-semibold rounded border border-[#d4af37]/45 hover:bg-[#d4af37] hover:text-[#0a0a0c] transition-all tracking-wider flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                SEPETE EKLE
              </button>
            ) : (
              <span className="text-xs text-red-500 font-semibold px-3 py-2 bg-red-950/20 border border-red-900/40 rounded">
                TÜKENDİ
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
