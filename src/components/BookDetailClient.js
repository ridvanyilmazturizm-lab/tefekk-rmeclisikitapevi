"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function BookDetailClient({ book }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const incrementQty = () => {
    if (quantity < book.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  // Mock Reviews tailored specifically to Rıdvan Yılmaz Turizm customers!
  const reviews = [
    {
      id: 1,
      name: "Ahmet H.",
      rating: 5,
      date: "12.05.2026",
      text: "Rıdvan Yılmaz Turizm ile katıldığım Siyer Umresi öncesi aldım. Mekke ve Medine'deki ziyaret noktalarını, özellikle Uhud ve Bedir savaş alanlarını o kadar güzel anlatıyor ki gitmeden önce mutlaka okunmalı.",
    },
    {
      id: 2,
      name: "Merve K.",
      rating: 5,
      date: "04.06.2026",
      text: "Dualar kitabı tam cep boyu, tavaf ve sa'y esnasında elimden düşürmedim. Arapça harfleri ve mealleri çok okunaklı. Çok memnun kaldım.",
    },
    {
      id: 3,
      name: "Süleyman Y.",
      rating: 4,
      date: "20.06.2026",
      text: "Kitaplığımıza kazandırdığımız harika bir eser. Rıdvan hocamızın seyahatlerde anlattığı manevi iklimi evde de hissettiriyor. Emeği geçenlerden Allah razı olsun.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Price, Stock and Cart controls */}
      <div className="glass-card-gold p-6 border border-[#d4af37]/35 rounded-xl space-y-6">
        <div className="flex items-baseline space-x-3">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Fiyat:</span>
          <span className="text-3xl font-bold font-serif text-[#d4af37]">
            {book.price.toFixed(2)} TL
          </span>
        </div>

        {/* Stock status */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Durum:</span>
          {book.stock > 0 ? (
            <span className="text-green-400 font-semibold bg-green-950/20 px-2 py-0.5 rounded border border-green-900/30">
              Stokta Var ({book.stock} adet)
            </span>
          ) : (
            <span className="text-red-400 font-semibold bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
              Tükendi
            </span>
          )}
        </div>

        {/* Add to Cart Actions */}
        {book.stock > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-[#202028] border border-[#2a2a35] rounded-lg p-1.5 w-full sm:w-32">
              <button
                onClick={decrementQty}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#18181f] text-gray-400 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="text-sm font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={incrementQty}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#18181f] text-gray-400 hover:text-white transition-colors"
                disabled={quantity >= book.stock}
              >
                +
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-widest rounded-lg hover:bg-none hover:bg-[#f3e5ab] transition-all shadow-lg shadow-[#d4af37]/10"
              id="add-to-cart-btn"
            >
              SEPETE EKLE
            </button>
          </div>
        )}

        {/* Support banner */}
        <div className="text-[11px] text-gray-500 border-t border-[#2a2a35] pt-4 flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-[#d4af37] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>PayTR güvencesiyle 3D Secure güvenli ödeme. Bursa içi elden teslimat imkanı.</span>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="glass-card border border-[#2a2a35] rounded-xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#2a2a35] bg-[#121216]">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wider transition-all border-b-2 ${
              activeTab === "description"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            AÇIKLAMA
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wider transition-all border-b-2 ${
              activeTab === "specs"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            ÜRÜN DETAYLARI
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wider transition-all border-b-2 ${
              activeTab === "reviews"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            DEĞERLENDİRMELER ({reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {book.description}
              </p>
              {book.category === "Manevi Seyahat & Siyer" && (
                <div className="p-4 bg-[#1e1d18] border border-[#d4af37]/20 rounded-lg text-xs text-gray-300 space-y-2 mt-4">
                  <span className="text-[#d4af37] font-bold block font-serif tracking-wider">
                    ÖNEMLİ TAVSİYE:
                  </span>
                  Bu kitap, acentemiz **Rıdvan Yılmaz Turizm** tarafından düzenlenen Hac & Umre ziyaretlerindeki manevi sohbet ve rehberlik programları ile uyumludur. Gitmeden önce okumanız gezi bilincinizi artıracaktır.
                </div>
              )}
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-[#2a2a35]">
                <span className="text-gray-500">Yazar:</span>
                <span className="text-gray-300 font-semibold">{book.author}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a35]">
                <span className="text-gray-500">Yayın Evi:</span>
                <span className="text-gray-300 font-semibold">{book.publisher}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a35]">
                <span className="text-gray-500">Sayfa Sayısı:</span>
                <span className="text-gray-300 font-semibold">{book.pages}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a35]">
                <span className="text-gray-500">Kategori:</span>
                <span className="text-gray-300 font-semibold">{book.category}</span>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-[#2a2a35] pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-200">{rev.name}</span>
                      <div className="flex items-center text-xs text-yellow-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-current" : "stroke-current fill-none"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{rev.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
