"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function CatalogPage({ initialBooks }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Categories list
  const categories = [
    "Tümü",
    "Manevi Seyahat & Siyer",
    "Tarih & Kültür",
    "Edebiyat & Düşünce",
  ];

  // States
  const [books, setBooks] = useState(initialBooks);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Read URL query params on load/change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else if (categoryParam === null) {
      setSelectedCategory("Tümü");
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Update URL helper
  const updateUrl = (category, search) => {
    const params = new URLSearchParams();
    if (category && category !== "Tümü") {
      params.set("category", category);
    }
    if (search) {
      params.set("search", search);
    }
    router.push(`/books?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateUrl(category, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateUrl(selectedCategory, query);
  };

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesCategory =
        selectedCategory === "Tümü" || book.category === selectedCategory;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // Default order
    });

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters - Desktop */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
        {/* Search Panel */}
        <div className="glass-card p-5 border border-[#2a2a35] rounded-xl">
          <h3 className="text-sm font-semibold tracking-wider font-serif text-[#d4af37] mb-3">
            KİTAP ARA
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Yazar veya eser adı..."
              className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37]/65 rounded-lg px-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
              id="catalog-search-input"
            />
            <svg
              className="w-4 h-4 text-gray-500 absolute right-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories Panel */}
        <div className="glass-card p-5 border border-[#2a2a35] rounded-xl">
          <h3 className="text-sm font-semibold tracking-wider font-serif text-[#d4af37] mb-4">
            KATEGORİLER
          </h3>
          <div className="flex flex-col space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-left text-xs px-3 py-2.5 rounded-lg transition-all font-medium tracking-wide flex items-center justify-between ${
                  selectedCategory === cat
                    ? "bg-gold-gradient text-[#0a0a0c] font-semibold shadow-md shadow-[#d4af37]/15"
                    : "text-gray-400 hover:bg-[#18181f] hover:text-white"
                }`}
                id={`cat-btn-${cat.replace(/\s+/g, "-")}`}
              >
                <span>{cat}</span>
                {selectedCategory !== cat && (
                  <span className="text-[10px] text-gray-600 bg-[#202028] px-2 py-0.5 rounded border border-[#2a2a35]">
                    {initialBooks.filter((b) => cat === "Tümü" || b.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Books Content Area */}
      <section className="flex-1 space-y-6">
        {/* Top Control Bar */}
        <div className="glass-card p-4 border border-[#2a2a35] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            Toplam <span className="text-[#d4af37] font-semibold">{filteredBooks.length}</span> eser listeleniyor.
          </div>
          {/* Sorting control */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500 font-medium">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#202028] border border-[#2a2a35] text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#d4af37]/60"
              id="catalog-sort"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyata Göre (Artan)</option>
              <option value="price-desc">Fiyata Göre (Azalan)</option>
              <option value="rating">Değerlendirmeye Göre</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="glass-card border border-[#2a2a35] p-16 text-center rounded-xl space-y-4">
            <svg
              className="w-16 h-16 text-gray-700 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-lg font-bold font-serif text-[#f3f4f6]">Eser Bulunamadı</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Arama kriterlerinize veya seçilen kategoriye uygun kitap bulunamadı. Lütfen filtreleri temizleyip tekrar deneyin.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Tümü");
                setSearchQuery("");
                updateUrl("Tümü", "");
              }}
              className="px-4 py-2 border border-[#d4af37] text-[#d4af37] text-xs font-semibold rounded hover:bg-[#d4af37] hover:text-[#0a0a0c] transition-all tracking-wider"
              id="clear-filters-btn"
            >
              FİLTRELERİ TEMİZLE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="glass-card-gold gold-glow-hover p-4 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  {/* Book Image */}
                  <div className="w-full h-56 bg-[#202028] rounded-lg border border-[#2a2a35] overflow-hidden flex items-center justify-center mb-4 relative">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-500 font-serif">KİTAP</span>
                    )}
                    <span className="absolute top-2 left-2 bg-[#0a0a0c]/85 text-[#d4af37] text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded border border-[#d4af37]/20 backdrop-blur-sm">
                      {book.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <Link href={`/books/${book.id}`} className="block">
                      <h4 className="text-sm md:text-base font-bold font-serif text-[#f3f4f6] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                        {book.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-400 font-medium">{book.author}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mt-1 text-[10px] text-yellow-500">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-gray-400 ml-1">
                      {book.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-[11px] text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Footer price/buy */}
                <div className="mt-4 pt-3 border-t border-[#2a2a35] flex items-center justify-between">
                  <span className="text-sm md:text-base font-bold font-serif text-[#d4af37]">
                    {book.price.toFixed(2)} TL
                  </span>

                  {book.stock > 0 ? (
                    <button
                      onClick={() => addToCart(book, 1)}
                      className="px-3 py-1.5 bg-[#18181f] text-[#d4af37] text-[10px] font-bold rounded border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#0a0a0c] transition-all tracking-wider"
                    >
                      SEPETE EKLE
                    </button>
                  ) : (
                    <span className="text-[9px] text-red-500 font-bold px-2 py-1 bg-red-950/20 border border-red-900/40 rounded">
                      TÜKENDİ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
