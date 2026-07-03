import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import FeaturedBooks from "../components/FeaturedBooks";
import HeroVideo from "../components/HeroVideo";

export const revalidate = 60; // Revalidate every minute

async function getBooks() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "books.json");
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read books for home page:", error);
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0a0a0c] via-[#121216] to-[#0a0a0c] pt-20 pb-28 px-6 md:px-12 overflow-hidden border-b border-[#2a2a35]/60">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Infinite Loop Video (Marked area) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <HeroVideo />
          </div>

          {/* Right Column: Title, Description and Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[#d4af37] text-xs md:text-sm font-semibold tracking-[0.3em] uppercase block animate-fade-in">
              İLİM VE İRFAN YOLCULUĞUNDA MANEVİ REHBERİNİZ
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white tracking-wider leading-tight">
              TEFEKKÜR MECLİSİ <br />
              <span className="text-gold">KİTAP EVİ</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed">
              Hac, Umre ve siyer araştırmalarına rehberlik edecek en kıymetli eserleri ve İslam medeniyetinin temel kaynaklarını sizler için bir araya getirdik.
            </p>

            {/* Search bar wrapper using native HTML form redirect */}
            <form
              action="/books"
              method="GET"
              className="max-w-xl flex items-center bg-[#18181f] border border-[#2a2a35] focus-within:border-[#d4af37]/65 rounded-full overflow-hidden p-1.5 shadow-xl shadow-black/40 transition-all duration-300"
            >
              <input
                type="text"
                name="search"
                placeholder="Kitap adı, yazar veya kategori arayın..."
                className="flex-1 bg-transparent border-none text-sm text-gray-100 placeholder-gray-500 px-5 focus:outline-none focus:ring-0"
                required
                id="search-input"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-wider rounded-full hover:bg-none hover:bg-[#f3e5ab] transition-all flex items-center gap-2"
                id="search-submit"
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
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                ARA
              </button>
            </form>

            {/* Quick Categories shortcut */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-[10px] md:text-xs font-semibold tracking-wider">
              <Link
                href="/books?category=Manevi+Seyahat+%26+Siyer"
                className="px-3 py-1.5 rounded-full border border-[#2a2a35] hover:border-[#d4af37] text-gray-400 hover:text-[#d4af37] transition-all"
              >
                # Manevi Seyahat & Siyer
              </Link>
              <Link
                href="/books?category=Tarih+%26+K%C3%BClt%C3%BCr"
                className="px-3 py-1.5 rounded-full border border-[#2a2a35] hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] transition-all"
              >
                # Tarih & Kültür
              </Link>
              <Link
                href="/books?category=Edebiyat+%26+D%C3%BC%C5%9F%C3%BCnce"
                className="px-3 py-1.5 rounded-full border border-[#2a2a35] hover:border-[#d4af37] text-gray-300 hover:text-[#d4af37] transition-all"
              >
                # Edebiyat & Düşünce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-3">
            <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase">
              SEÇKİN KOLEKSİYONIMUZ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
              ÖNE ÇIKAN KİTAPLAR
            </h2>
          </div>
          <Link
            href="/books"
            className="text-sm font-semibold text-[#d4af37] hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5"
            id="view-all-books"
          >
            Tüm Kitapları İncele
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Catalog Grid Renderer */}
        <FeaturedBooks books={books} />
      </section>

      {/* Manevi Turizm & Siyer Umresi Connection Banner */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-[#16161a] to-[#0c0c0e] border-y border-[#2a2a35] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[100%] bg-radial-gradient from-[#d4af37]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cover/Graphic representation */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="w-full max-w-sm aspect-[4/3] rounded-2xl border border-[#d4af37]/20 bg-[#18181f] p-4 shadow-2xl relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop"
                alt="Mecca Medina Travels"
                className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase">
                  SİYER UMRESİ ORGANİZASYONU
                </span>
                <h3 className="text-xl font-bold font-serif text-white mt-1">
                  Rıdvan Yılmaz Turizm
                </h3>
              </div>
            </div>
          </div>

          {/* Banner Text description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase">
                ACENTE & KÜTÜPHANE BİRLİKTELİĞİ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white leading-tight">
                Manevi Yolculukları Kitaplarla Anlamlandırıyoruz
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              **Rıdvan Yılmaz Turizm** bünyesinde gerçekleştirdiğimiz tematik **Siyer Umresi** ve Hac turlarımız için özel olarak derlenen bu kitaplık; ziyaret edeceğiniz Bedir, Uhud, Hendek savaş meydanlarını, Hira ve Sevr mağaralarını gitmeden önce okuyarak seyahatinizi manevi açıdan zenginleştirmenizi hedefler.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://www.instagram.com/ridvanyilmazturizm/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#d4af37] text-[#0a0a0c] font-bold rounded-lg hover:bg-[#f3e5ab] transition-all tracking-wider text-xs shadow-lg shadow-[#d4af37]/15"
                id="instagram-promo-button"
              >
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                INSTAGRAM'DA BİZİ TAKİP EDİN
              </a>
              <Link
                href="/books?category=Manevi+Seyahat+%26+Siyer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#18181f] text-gray-300 font-bold rounded-lg border border-[#2a2a35] hover:border-[#d4af37] hover:text-white transition-all tracking-wider text-xs"
              >
                REHBER KİTAPLARI LİSTELE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-[#2a2a35]/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 text-center space-y-4 border border-[#2a2a35] hover:border-[#d4af37]/30 transition-all rounded-xl">
            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-[#d4af37]"
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
            </div>
            <h3 className="text-lg font-bold font-serif text-white">Güvenli Ödeme</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              PayTR 256-bit SSL şifreli güvenli ödeme altyapısı, Kapıda Ödeme ve Havale/EFT gibi farklı ödeme yöntemleriyle güvence altındasınız.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 text-center space-y-4 border border-[#2a2a35] hover:border-[#d4af37]/30 transition-all rounded-xl">
            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-[#d4af37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">Özel Kaynaklar</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Siyer-i Nebi, dini kaynaklar, fıkıh, tefsir, manevi gelişim ve kutsal topraklar seyahat rehberlerinden oluşan prestijli yayın yelpazesi.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 text-center space-y-4 border border-[#2a2a35] hover:border-[#d4af37]/30 transition-all rounded-xl">
            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-[#d4af37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">Acente Güvencesi</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Rıdvan Yılmaz Turizm güvencesiyle, Bursa merkezli ofisimiz ve tecrübeli ekibimizle tüm sipariş ve rehberlik süreçlerinde yanınızdayız.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
