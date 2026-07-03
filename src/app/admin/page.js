"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order Management States
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [activeTab, setActiveTab] = useState("katalog"); // katalog, siparisler
  const [trackingInputs, setTrackingInputs] = useState({}); // { [orderId]: trackingNumber }
  const [isUploading, setIsUploading] = useState(false);
  
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Check authentication session on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (passwordInput === "tefekkur123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthError("");
    } else {
      setAuthError("Hatalı yönetici şifresi girdiniz.");
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Siparişler yüklenirken bir hata oluştu.");
      const data = await res.json();
      setOrders(data);

      // Pre-populate tracking text fields
      const inputs = {};
      data.forEach((o) => {
        inputs[o.id] = o.trackingNumber || "";
      });
      setTrackingInputs(inputs);
      setOrdersError(null);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // Update order status/tracking in DB
  const handleUpdateOrder = async (orderId, updatedFields) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        alert("Sipariş bilgileri başarıyla güncellendi.");
        fetchOrders();
      } else {
        alert("Sipariş güncellenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  // Upload book cover image file to serverless storage / local fallback
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!res.ok) {
        throw new Error("Resim yükleme sırasında sunucu hatası oluştu.");
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        coverImage: data.url,
      }));
    } catch (err) {
      console.error(err);
      alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsUploading(false);
    }
  };

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
    fetchOrders();
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

  if (!isAuthenticated) {
    return (
      <div className="bg-[#0a0a0c] min-h-screen flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full glass-card p-8 border border-[#d4af37]/35 rounded-2xl shadow-2xl space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase block">
              GÜVENLİ YÖNETİCİ GİRİŞİ
            </span>
            <h2 className="text-2xl font-bold font-serif text-white tracking-wide">
              TEFEKKÜR MECLİSİ
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold uppercase tracking-wider block">YÖNETİCİ ŞİFRESİ</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#18181f] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-all"
              />
            </div>

            {authError && (
              <p className="text-red-400 font-semibold text-[11px] bg-red-950/20 border border-red-900/40 p-2 rounded">
                ⚠️ {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-widest rounded-lg hover:bg-none hover:bg-[#f3e5ab] transition-all shadow-lg shadow-[#d4af37]/15 cursor-pointer"
            >
              GİRİŞ YAP
            </button>
          </form>

          <Link href="/" className="inline-block text-[11px] text-gray-500 hover:text-[#d4af37] transition-colors mt-2">
            ← Ana Sayfaya Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2a2a35] pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif text-white tracking-wider">
              YÖNETİCİ <span className="text-gold">PANELİ</span>
            </h1>
            <p className="text-xs text-gray-400">Kitap kütüphanenizi, siparişlerinizi ve ürün katalog bilgilerini yönetin.</p>
          </div>
          {activeTab === "katalog" && (
            <button
              onClick={handleAddClick}
              className="px-5 py-2.5 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-wider rounded-lg hover:bg-none hover:bg-[#f3e5ab] transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/10"
              id="add-new-book-btn"
            >
              <span>+</span> YENİ KİTAP EKLE
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-6 border-b border-[#2a2a35]/65 pb-0.5 text-xs font-bold tracking-widest">
          <button
            onClick={() => setActiveTab("katalog")}
            className={`pb-3 transition-all border-b-2 uppercase ${activeTab === "katalog" ? "border-[#d4af37] text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            📚 Katalog Yönetimi
          </button>
          <button
            onClick={() => setActiveTab("siparisler")}
            className={`pb-3 transition-all border-b-2 uppercase ${activeTab === "siparisler" ? "border-[#d4af37] text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            📦 Sipariş Yönetimi
          </button>
        </div>

        {activeTab === "katalog" ? (
          <>

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
          </>
        ) : (
          <div className="space-y-6">
            <div className="glass-card border border-[#2a2a35] rounded-xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-[#2a2a35] bg-[#121216]">
                <h3 className="text-sm font-bold font-serif tracking-wider text-gray-200">
                  GELEN SİPARİŞ LİSTESİ
                </h3>
              </div>

              {isOrdersLoading ? (
                <div className="p-16 text-center text-xs text-gray-500 animate-pulse">
                  Sipariş verileri sunucudan yükleniyor...
                </div>
              ) : ordersError ? (
                <div className="p-16 text-center text-xs text-red-400">
                  Hata: {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div className="p-16 text-center text-xs text-gray-500">
                  Henüz gelen bir sipariş bulunmuyor.
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#2a2a35] rounded-xl overflow-hidden bg-[#0c0c0f] text-left">
                      {/* Order Summary Header */}
                      <div className="p-4 sm:p-5 bg-[#141419] border-b border-[#2a2a35] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-[#d4af37] font-serif">{order.id}</span>
                            <span className="text-[10px] text-gray-400 bg-[#202028] px-2 py-0.5 rounded">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString("tr-TR") : "-"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 font-semibold">
                            Alıcı: {order.customerName} | Tel: {order.customerPhone}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Order Status Badge */}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrder(order.id, { orderStatus: e.target.value })}
                            className="bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded px-2.5 py-1.5 text-[11px] font-bold text-gray-200 focus:outline-none"
                          >
                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                            <option value="Kargoya Verildi">Kargoya Verildi</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                            <option value="İptal Edildi">İptal Edildi</option>
                          </select>

                          {/* Payment Status Badge */}
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdateOrder(order.id, { paymentStatus: e.target.value })}
                            className="bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded px-2.5 py-1.5 text-[11px] font-bold text-gray-200 focus:outline-none"
                          >
                            <option value="Havale Bekleniyor">Havale Bekleniyor</option>
                            <option value="Ödeme Onaylandı">Ödeme Onaylandı</option>
                            <option value="Kapıda Ödeme">Kapıda Ödeme</option>
                          </select>

                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Toplam</span>
                            <span className="text-sm font-bold text-[#d4af37]">{order.totalPrice.toFixed(2)} TL</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details Body */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs text-left">
                        {/* Shipping Address */}
                        <div className="lg:col-span-4 space-y-3">
                          <h4 className="font-bold text-gray-300 uppercase tracking-wider border-b border-[#2a2a35]/65 pb-1">
                            Teslimat & Kargo
                          </h4>
                          <div className="space-y-1.5 text-gray-400">
                            <div>
                              <span className="font-semibold text-gray-300 block">Adres:</span>
                              {order.addressStreet}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-300 block">Şehir / Posta Kodu:</span>
                              {order.addressCity} {order.addressZip && `/ ${order.addressZip}`}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-300">Kargo Firması:</span>{" "}
                              <span className="text-gray-200 uppercase font-bold">{order.shippingMethod}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-300">Ödeme Şekli:</span>{" "}
                              <span className="text-gray-200 uppercase font-bold">
                                {order.paymentMethod === "cod" ? "Kapıda Ödeme" : "Banka Havalesi (EFT)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items Purchased */}
                        <div className="lg:col-span-5 space-y-3">
                          <h4 className="font-bold text-gray-300 uppercase tracking-wider border-b border-[#2a2a35]/65 pb-1">
                            Satın Alınan Eserler ({order.items?.length || 0})
                          </h4>
                          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-[#141419] p-2 rounded border border-[#2a2a35]/40">
                                <div className="space-y-0.5 max-w-[75%] text-left">
                                  <span className="font-bold text-gray-200 block truncate">{item.title}</span>
                                  <span className="text-[10px] text-gray-500 block truncate">{item.author}</span>
                                </div>
                                <div className="text-right text-gray-400">
                                  <span className="font-semibold text-[#d4af37] block">{item.price} TL</span>
                                  <span className="text-[10px]">Adet: {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking Input */}
                        <div className="lg:col-span-3 space-y-3">
                          <h4 className="font-bold text-gray-300 uppercase tracking-wider border-b border-[#2a2a35]/65 pb-1">
                            Kargo Takip No
                          </h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={trackingInputs[order.id] || ""}
                              onChange={(e) =>
                                setTrackingInputs({
                                  ...trackingInputs,
                                  [order.id]: e.target.value,
                                })
                              }
                              placeholder="Kargo takip kodu yazın"
                              className="w-full bg-[#18181f] border border-[#2a2a35] focus:border-[#d4af37] rounded px-3 py-2 text-gray-200 focus:outline-none"
                            />
                            <button
                              onClick={() => handleUpdateOrder(order.id, { trackingNumber: trackingInputs[order.id] })}
                              className="w-full py-2 bg-[#18181f] border border-[#d4af37]/35 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0c] text-[10px] font-bold tracking-widest rounded transition-all cursor-pointer"
                            >
                              TAKİP NO KAYDET
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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

              {/* Cover Image Upload & URL Fallback */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-gray-500 font-bold uppercase">Kapak Görseli</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* File Picker */}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-file-picker"
                      />
                      <label
                        htmlFor="image-file-picker"
                        className={`w-full bg-[#18181f] border border-[#2a2a35] hover:border-[#d4af37] rounded-lg px-3.5 py-2.5 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {isUploading ? "GÖRSEL YÜKLENİYOR..." : "BİLGİSAYARDAN RESİM SEÇ"}
                      </label>
                    </div>
                  </div>
                  {/* Read-only URL fallback so they can see the address */}
                  <input
                    type="text"
                    readOnly
                    value={formData.coverImage}
                    placeholder="Görsel adresi yüklemeden sonra burada görünecektir"
                    className="w-full bg-[#202028]/50 border border-[#2a2a35]/60 text-gray-500 rounded-lg px-3.5 py-2 text-[10px] focus:outline-none mt-1"
                  />
                </div>

                {/* Cover Image Preview */}
                <div className="sm:col-span-4 flex justify-center">
                  <div className="w-20 h-24 bg-[#141419] border border-[#2a2a35] rounded overflow-hidden flex items-center justify-center relative">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-600 font-bold uppercase text-center p-1">Görsel Yok</span>
                    )}
                  </div>
                </div>
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
