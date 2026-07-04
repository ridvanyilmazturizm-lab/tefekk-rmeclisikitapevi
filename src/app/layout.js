import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import WhatsAppButton from "../components/WhatsAppButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TEFEKKÜR MECLİSİ KİTAP EVİ | Hac, Umre ve Manevi Kitaplar",
  description: "Umre, Hac ve manevi gezi organizasyonlarının öncüsü Rıdvan Yılmaz Turizm güvencesiyle; dini kitaplar, siyer kaynakları, seyahat rehberleri ve mukaddes mekânların tarihini anlatan eserleri barındıran online kitabevi.",
  keywords: ["kitap", "kitabevi", "dini kitaplar", "siyer", "umre rehberi", "hac rehberi", "rıdvan yılmaz turizm", "rıdvan yılmaz", "bursa turizm"],
  authors: [{ name: "Tefekkür Meclisi Kitap Evi" }],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-[#f3f4f6] font-sans antialiased">
        <CartProvider>
          {/* Global Header */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          {/* Cart Drawer Overlay */}
          <CartDrawer />
          
          {/* Floating WhatsApp Support Button */}
          <WhatsAppButton />
          
          {/* Premium Footer */}
          <footer className="bg-[#121216] border-t border-[#2a2a35] py-12 px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and Info */}
              <div className="space-y-4">
                <Link href="/" className="flex flex-col">
                  <span className="text-xl font-bold tracking-widest font-serif text-[#d4af37]">
                    TEFEKKÜR MECLİSİ
                  </span>
                  <span className="text-xs font-semibold tracking-[0.25em] text-[#f3f4f6]/80">
                    KİTAP EVİ
                  </span>
                </Link>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Manevi seyahatlerinizde ve ilim yolculuğunuzda size yoldaşlık edecek en değerli eserler, güvenli alışveriş altyapısıyla kapınızda.
                </p>
                <div className="flex space-x-4 pt-2">
                  <a
                    href="https://www.instagram.com/ridvanyilmazturizm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#d4af37] transition-colors"
                    id="footer-instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider font-serif text-[#d4af37] mb-4">
                  KÜTÜPHANE
                </h3>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>
                    <Link href="/books" className="hover:text-white transition-colors" id="footer-link-all">
                      Tüm Kitaplar
                    </Link>
                  </li>
                  <li>
                    <Link href="/books?category=Manevi+Seyahat+%26+Siyer" className="hover:text-white transition-colors" id="footer-link-manevi">
                      Manevi Seyahat & Siyer
                    </Link>
                  </li>
                  <li>
                    <Link href="/books?category=Tarih+%26+K%C3%BClt%C3%BCr" className="hover:text-white transition-colors" id="footer-link-history">
                      Tarih & Kültür
                    </Link>
                  </li>
                  <li>
                    <Link href="/books?category=Edebiyat+%26+D%C3%BC%C5%9F%C3%BCnce" className="hover:text-white transition-colors" id="footer-link-literature">
                      Edebiyat & Düşünce
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Information */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider font-serif text-[#d4af37] mb-4">
                  YASAL BİLGİLER
                </h3>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>
                    <Link href="/legal?tab=kvkk" className="hover:text-white transition-colors" id="footer-link-kvkk">
                      KVKK Aydınlatma Metni
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal?tab=mesafeli-satis" className="hover:text-white transition-colors" id="footer-link-satis">
                      Mesafeli Satış Sözleşmesi
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal?tab=on-bilgilendirme" className="hover:text-white transition-colors" id="footer-link-bilgilendirme">
                      Ön Bilgilendirme Formu
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal?tab=gizlilik" className="hover:text-white transition-colors" id="footer-link-gizlilik">
                      Gizlilik & Güvenlik Politikası
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider font-serif text-[#d4af37] mb-4">
                  İLETİŞİM & ACENTE
                </h3>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>Reyhan Mah. 8. Park Sok. Baycan Plaza No: 10 Kat: 4 Daire: 2, Osmangazi/Bursa</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.996.86h3.981a1 1 0 00.996-.86l.548-2.2a1 1 0 01.94-.725H21a2 2 0 012 2v1.5a10 10 0 01-10 10H11a10 10 0 01-10-10V5z" />
                    </svg>
                    <span>0538 399 96 66</span>
                  </li>
                  <li className="pt-2">
                    <a
                      href="https://www.ridvanyilmazturizm.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-[#18181f] text-[#d4af37] border border-[#2a2a35] hover:border-[#d4af37] rounded transition-all text-[11px] font-semibold"
                      id="footer-tourism-link"
                    >
                      RIDVAN YILMAZ TURİZM SİTESİ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-[#2a2a35] mt-8 pt-6 text-center text-[10px] text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
              <p>&copy; {new Date().getFullYear()} Tefekkür Meclisi Kitap Evi. Tüm hakları saklıdır.</p>
              <p className="mt-2 md:mt-0 flex items-center gap-1.5 text-[11px] text-gray-400">
                <span>Designed & Crafted with 💛 by</span>
                <span className="text-[#d4af37] font-bold hover:text-[#f3e5ab] transition-colors tracking-wide text-xs">Semih Kaçmaz</span>
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
