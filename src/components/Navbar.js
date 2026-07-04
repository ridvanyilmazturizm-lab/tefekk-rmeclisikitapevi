"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { setIsCartOpen, getCartCount, getCartTotal, isMounted } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Fetch books for search once on focus
  const handleSearchFocus = async () => {
    setIsSearchFocused(true);
    if (allBooks.length === 0) {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          setAllBooks(data);
        }
      } catch (err) {
        console.error("Arama verileri yüklenirken hata:", err);
      }
    }
  };

  // Perform instant client-side filtering on typing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allBooks
      .filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5); // Limit matching items to top 5
    setSearchResults(filtered);
  };

  // Handle enter key or button click search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      router.push(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#2a2a35] py-4 px-6 md:px-12 flex items-center justify-between gap-4">
      {/* Brand Logo */}
      <Link href="/" className="flex flex-col flex-shrink-0">
        <span className="text-lg md:text-xl font-bold tracking-widest font-serif text-[#d4af37] hover:opacity-90 transition-opacity">
          TEFEKKÜR MECLİSİ
        </span>
        <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-[#f3f4f6]/80 text-center">
          KİTAP EVİ
        </span>
      </Link>

      {/* Navigation Links - Desktop */}
      <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs xl:text-sm font-medium tracking-wider">
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
      </div>

      {/* Smart Live Search - Desktop */}
      <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-64 xl:w-80">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Eser veya yazar ara..."
            className="w-full bg-[#18181f] border border-[#2a2a35] focus:border-[#d4af37]/65 rounded-full px-4 py-2 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
            id="navbar-search-desktop"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Live Dropdown Results */}
        {isSearchFocused && searchQuery.trim() !== "" && (
          <div className="absolute top-[38px] left-0 right-0 bg-[#121216]/95 backdrop-blur-md border border-[#2a2a35] rounded-xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto text-left">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                Sonuç bulunamadı.
              </div>
            ) : (
              <div className="py-1">
                {searchResults.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#18181f] border-b border-[#2a2a35]/40 last:border-0 transition-colors"
                  >
                    <div className="w-8 h-10 bg-[#202028] border border-[#2a2a35]/50 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[7px] text-gray-500">KİTAP</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-200 truncate">{book.title}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{book.author}</p>
                    </div>
                    <span className="text-xs font-bold text-[#d4af37] flex-shrink-0">{book.price.toFixed(2)} TL</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Actions */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative px-4 py-2 text-gray-300 hover:text-[#d4af37] transition-all bg-[#18181f] rounded-full border border-[#2a2a35] hover:border-[#d4af37]/50 flex items-center gap-2 cursor-pointer"
          id="navbar-cart-btn"
        >
          <svg
            className="w-4 h-4 text-[#d4af37]"
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
          <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-gray-300">SEPETİM</span>
          {isMounted && getCartCount() > 0 && (
            <span className="text-[10px] font-bold bg-[#d4af37] text-[#0a0a0c] px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {getCartCount()}
            </span>
          )}
          {isMounted && getCartCount() > 0 && (
            <span className="hidden md:inline text-[10px] text-gray-400 font-semibold border-l border-[#2a2a35] pl-2">
              {getCartTotal().toFixed(2)} TL
            </span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-[#d4af37] transition-colors bg-[#18181f] rounded border border-[#2a2a35] cursor-pointer"
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
        <div className="absolute top-[73px] left-0 right-0 bg-[#121216] border-b border-[#2a2a35] py-4 px-6 flex flex-col space-y-4 lg:hidden shadow-xl z-50">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Eser veya yazar ara..."
                className="w-full bg-[#18181f] border border-[#2a2a35] focus:border-[#d4af37]/65 rounded-full px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
                id="navbar-search-mobile"
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3.5 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile live results dropdown */}
            {isSearchFocused && searchQuery.trim() !== "" && (
              <div className="absolute top-[42px] left-0 right-0 bg-[#121216] border border-[#2a2a35] rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto text-left">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    Sonuç bulunamadı.
                  </div>
                ) : (
                  <div className="py-1">
                    {searchResults.map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchFocused(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#18181f] border-b border-[#2a2a35]/40 last:border-0 transition-colors"
                      >
                        <div className="w-7 h-9 bg-[#202028] border border-[#2a2a35]/50 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[7px] text-gray-500">KİTAP</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-gray-200 truncate">{book.title}</h4>
                          <p className="text-[9px] text-gray-400 truncate">{book.author}</p>
                        </div>
                        <span className="text-[11px] font-bold text-[#d4af37] flex-shrink-0">{book.price.toFixed(2)} TL</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#f3f4f6] hover:text-[#d4af37] font-medium tracking-wide text-xs"
          >
            ANASAYFA
          </Link>
          <Link
            href="/books"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#f3f4f6] hover:text-[#d4af37] font-medium tracking-wide text-xs"
          >
            TÜM KİTAPLAR
          </Link>
          <Link
            href="/books?category=Manevi+Seyahat+%26+Siyer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#d4af37] hover:text-[#f3e5ab] font-medium tracking-wide text-xs flex items-center gap-1"
          >
            MANEVİ SEYAHAT & SİYER
          </Link>
        </div>
      )}
    </nav>
  );
}
