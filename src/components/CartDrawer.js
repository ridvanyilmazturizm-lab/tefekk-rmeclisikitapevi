"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    addToCart,
    isMounted,
  } = useCart();

  const [allBooks, setAllBooks] = useState([]);

  // Fetch books for cross-selling recommendations
  useEffect(() => {
    if (isCartOpen) {
      fetch("/api/books")
        .then((res) => res.json())
        .then((data) => setAllBooks(data))
        .catch((err) => console.error("Error fetching books in drawer:", err));
    }
  }, [isCartOpen]);

  if (!isMounted || !isCartOpen) return null;

  // Filter out books already in the cart and show up to 2 recommendations
  const recommendations = allBooks
    .filter((book) => !cart.some((item) => item.id === book.id))
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#121216] border-l border-[#2a2a35] h-full shadow-2xl flex flex-col p-6 text-gray-100 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#2a2a35]">
          <h2 className="text-xl font-semibold tracking-wider font-serif text-[#d4af37]">
            SEPETİNİZ
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-[#d4af37] transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-400 font-medium">Sepetiniz henüz boş.</p>
              <Link
                href="/books"
                onClick={() => setIsCartOpen(false)}
                className="inline-block px-4 py-2 border border-[#d4af37] text-[#d4af37] rounded hover:bg-[#d4af37] hover:text-[#0a0a0c] transition-all text-sm font-medium tracking-wider"
              >
                KİTAPLARI İNCELE
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-3 bg-[#18181f] rounded-lg border border-[#2a2a35]"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 bg-[#202028] rounded border border-[#2a2a35] overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-500 font-serif">
                      KİTAP
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate text-[#f3f4f6]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{item.author}</p>
                  <p className="text-sm text-[#d4af37] font-semibold mt-1">
                    {item.price.toFixed(2)} TL
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#202028] rounded border border-[#2a2a35] text-gray-400 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#202028] rounded border border-[#2a2a35] text-gray-400 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}

          {/* Recommendations in Cart Drawer */}
          {cart.length > 0 && recommendations.length > 0 && (
            <div className="mt-8 border-t border-[#2a2a35]/65 pt-6 space-y-4">
              <h4 className="text-xs font-bold font-serif tracking-wider text-[#d4af37]">
                İLGİNİZİ ÇEKEBİLECEK DİĞER ESERLER
              </h4>
              <div className="space-y-3">
                {recommendations.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-2.5 bg-[#18181f] border border-[#2a2a35]/60 rounded-lg hover:border-[#d4af37]/35 transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-12 bg-[#202028] rounded border border-[#2a2a35]/50 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-bold text-gray-500 font-serif">KİTAP</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-gray-200 truncate">{book.title}</h5>
                        <p className="text-[10px] text-[#d4af37] font-semibold mt-0.5">{book.price.toFixed(2)} TL</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(book, 1)}
                      className="ml-3 px-3 py-1 bg-[#202028] hover:bg-[#d4af37] border border-[#d4af37]/45 text-[#d4af37] hover:text-[#0a0a0c] text-[10px] font-bold rounded transition-all flex-shrink-0"
                    >
                      Ekle +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-[#2a2a35] space-y-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Toplam Tutar:</span>
              <span className="text-[#d4af37] text-lg font-serif">
                {getCartTotal().toFixed(2)} TL
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Kargo ücreti ve vergiler ödeme adımında hesaplanacaktır.
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center py-3 bg-gold-gradient text-[#0a0a0c] font-semibold rounded hover:bg-none hover:bg-[#f3e5ab] transition-all tracking-wider text-sm shadow-lg shadow-[#d4af37]/10 hover:shadow-[#d4af37]/25"
            >
              SİPARİŞİ TAMAMLA
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-xs text-gray-400 hover:text-[#d4af37] transition-colors"
            >
              Alışverişe Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
