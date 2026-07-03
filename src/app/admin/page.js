"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null if adding new book

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "Manevi Seyahat & Siyer",
    coverImage: "",
    description: "",
    stock: "",
    pages: "",
    publisher: "",
  });

  // Fetch all books
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Kitaplar yüklenirken bir hata oluştu.");
      const data = await res.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Open modal for Adding
  const handleAddClick = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      price: "",
      category: "Manevi Seyahat & Siyer",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      description: "",
      stock: "100",
      pages: "200",
      publisher: "Manevi Coğrafya Yayınları",
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleEditClick = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: String(book.price),
      category: book.category,
      coverImage: book.coverImage || "",
      description: book.description || "",
      stock: String(book.stock),
      pages: String(book.pages || ""),
      publisher: book.publisher || "",
    });
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = async (bookId, title) => {
    if (!confirm(`"${title}" adlı eseri silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Eser başarıyla silindi.");
        fetchBooks();
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      pages: parseInt(formData.pages) || 0,
    };

    const url = editingBook ? `/api/books/${editingBook.id}` : "/api/books";
    const method = editingBook ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingBook ? "Eser başarıyla güncellendi." : "Eser başarıyla eklendi.");
        setIsModalOpen(false);
        fetchBooks();
      } else {
        alert("Kayıt işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  // Stats helper calculations
  const totalBooks = books.length;
  const lowStockCount = books.filter((b) => b.stock < 10).length;
  const categoriesList = [...new Set(books.map((b) => b.category))];
  const totalStockQuantity = books.reduce((sum, b) => sum + b.stock, 0);

  return (
    <div className="bg-[#0a0a0c] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2a2a35] pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif text-white tracking-wider">
              YÖNETİCİ <span className="text-gold">PANELİ</span>
            </h1>
            <p className="text-xs text-gray-400">Kitap kütüphanenizi ve ürün katalog bilgilerini yönetin.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-wider rounded-lg hover:bg-none hover:bg-[#f3e5ab] transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/10"
            id="add-new-book-btn"
          >
            <span>+</span> YENİ KİTAP EKLE
          </button>
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-5 border border-[#2a2a35] rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Katalog Eser</span>
              <span className="text-xl font-bold font-serif text-white">{totalBooks} Başlık</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-5 border border-[#2a2a35] rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Toplam Envanter</span>
              <span className="text-xl font-bold font-serif text-white">{totalStockQuantity} Adet</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`glass-card p-5 border rounded-xl flex items-center space-x-4 ${lowStockCount > 0 ? "border-red-900/40 bg-red-950/5" : "border-[#2a2a35]"}`}>
            <div className={`p-3 rounded-lg ${lowStockCount > 0 ? "bg-red-950 text-red-400" : "bg-[#d4af37]/10 text-[#d4af37]"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Kritik Stok</span>
              <span className={`text-xl font-bold font-serif ${lowStockCount > 0 ? "text-red-400" : "text-white"}`}>
                {lowStockCount} Eser
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-5 border border-[#2a2a35] rounded-xl flex items-center space-x-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Kategoriler</span>
              <span className="text-xl font-bold font-serif text-white">{categoriesList.length} Grup</span>
            </div>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="glass-card border border-[#2a2a35] rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#2a2a35] bg-[#121216]">
            <h3 className="text-sm font-bold font-serif tracking-wider text-gray-200">
              ÜRÜN ENVANTER LİSTESİ
            </h3>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-xs text-gray-500 animate-pulse">
              Kitap bilgileri sunucudan yükleniyor...
            </div>
          ) : error ? (
            <div className="p-16 text-center text-xs text-red-400">
              Hata: {error}
            </div>
          ) : books.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-500">
              Katalogda henüz hiç kitap bulunmuyor. Yeni bir tane ekleyerek başlayabilirsiniz.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2a2a35] text-gray-400 uppercase tracking-wider bg-[#18181f]/40">
                    <th className="px-6 py-3.5 font-bold">Resim</th>
                    <th className="px-6 py-3.5 font-bold">Eser Bilgisi</th>
                    <th className="px-6 py-3.5 font-bold">Kategori</th>
                    <th className="px-6 py-3.5 font-bold">Yayınevi</th>
                    <th className="px-6 py-3.5 font-bold text-right">Fiyat</th>
                    <th className="px-6 py-3.5 font-bold text-center">Stok</th>
                    <th className="px-6 py-3.5 font-bold text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a35]/65">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-[#18181f]/35 transition-colors">
                      {/* Cover Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="w-10 h-12 bg-[#202028] border border-[#2a2a35] rounded overflow-hidden flex items-center justify-center relative">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[8px] font-bold text-gray-500 font-serif">KİTAP</span>
                          )}
                        </div>
                      </td>

                      {/* Title & Author */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 max-w-[200px]">
                          <span className="font-bold text-gray-200 block truncate">{book.title}</span>
                          <span className="text-gray-500 block truncate">{book.author}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-300 font-medium">
                        {book.category}
                      </td>

                      {/* Publisher */}
                      <td className="px-6 py-4 text-gray-400">
                        {book.publisher || "-"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right font-semibold text-[#d4af37]">
                        {book.price.toFixed(2)} TL
                      </td>

                      {/* Stock Badges */}
                      <td className="px-6 py-4 text-center">
                        {book.stock <= 0 ? (
                          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded text-red-400 bg-red-950/20 border border-red-900/40">
                            Tükendi
                          </span>
                        ) : book.stock < 10 ? (
                          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded text-yellow-400 bg-yellow-950/20 border border-yellow-900/40">
                            Az ({book.stock})
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded text-green-400 bg-green-950/20 border border-green-900/40">
                            {book.stock} Adet
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="px-2.5 py-1.5 bg-[#18181f] text-gray-300 border border-[#2a2a35] hover:border-[#d4af37] rounded hover:text-white transition-colors"
                          id={`edit-btn-${book.id}`}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book.id, book.title)}
                          className="px-2.5 py-1.5 bg-[#18181f] text-red-400 border border-red-900/20 hover:border-red-900/50 rounded hover:bg-red-950/15 transition-colors"
                          id={`delete-btn-${book.id}`}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#121216] border border-[#d4af37]/35 rounded-xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 text-gray-300 shadow-2xl animate-fade-in space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#2a2a35] pb-3">
              <h2 className="text-base font-bold font-serif text-[#d4af37] uppercase">
                {editingBook ? "KİTAP DÜZENLE" : "YENİ KİTAP EKLE"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Kitap Başlığı</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Siyer Rehberi"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Yazar Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="İlber Ortaylı"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Fiyat (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="120.00"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  >
                    <option value="Manevi Seyahat & Siyer">Manevi Seyahat & Siyer</option>
                    <option value="Tarih & Kültür">Tarih & Kültür</option>
                    <option value="Edebiyat & Düşünce">Edebiyat & Düşünce</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="text-gray-500 font-bold uppercase">Kapak Görseli URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                />
              </div>

              {/* Stock, Pages, Publisher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Stok Adeti</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Sayfa Sayısı</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    placeholder="320"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Yayın Evi</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    placeholder="Timaş Yayınları"
                    className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-gray-500 font-bold uppercase">Eser Açıklaması</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kitap hakkında detaylı açıklama yazın..."
                  rows="4"
                  className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none resize-none"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#2a2a35] hover:border-gray-500 rounded text-gray-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-gradient text-[#0a0a0c] font-bold rounded hover:bg-none hover:bg-[#f3e5ab] transition-all"
                  id="modal-submit-btn"
                >
                  {editingBook ? "Kaydet" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
