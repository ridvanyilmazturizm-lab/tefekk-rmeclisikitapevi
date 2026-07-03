import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import BookDetailClient from "../../../components/BookDetailClient";

export const revalidate = 0; // Fresh stock data

async function getBook(id) {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "books.json");
    const data = await fs.readFile(dataFilePath, "utf8");
    const books = JSON.parse(data);
    return books.find((b) => b.id === id) || null;
  } catch (error) {
    console.error("Error reading single book data:", error);
    return null;
  }
}

// Generate metadata dynamically for maximum SEO impact!
export async function generateMetadata({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) {
    return { title: "Eser Bulunamadı | Tefekkür Meclisi Kitap Evi" };
  }
  return {
    title: `${book.title} - ${book.author} | Tefekkür Meclisi Kitap Evi`,
    description: `${book.title} kitabı en cazip fiyatlarla Tefekkür Meclisi Kitap Evi'nde. ${book.description.substring(0, 150)}...`,
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/20 border border-red-900/40 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white">Eser Bulunamadı</h2>
        <p className="text-sm text-gray-400">
          Aramış olduğunuz kitap kütüphanemizde bulunmamaktadır veya kaldırılmış olabilir.
        </p>
        <Link
          href="/books"
          className="inline-block px-5 py-2.5 bg-[#d4af37] text-[#0a0a0c] font-bold rounded hover:bg-[#f3e5ab] transition-all text-xs tracking-wider"
        >
          TÜM KİTAPLARA DÖN
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 tracking-wider flex items-center space-x-2">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">ANASAYFA</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-[#d4af37] transition-colors">TÜM KİTAPLAR</Link>
          <span>/</span>
          <span className="text-[#d4af37] font-semibold">{book.category}</span>
        </nav>

        {/* Core Book Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Column - Book Cover */}
          <div className="md:col-span-4 flex justify-center">
            <div className="w-full max-w-sm aspect-[3/4] bg-[#18181f] border border-[#2a2a35] rounded-xl overflow-hidden shadow-2xl relative p-4 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg border border-[#2a2a35]"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-500 font-serif">KİTAP KAPAĞI</span>
              )}
            </div>
          </div>

          {/* Right Column - Title, Specs, Client controls */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase block">
                {book.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-serif text-white tracking-wide">
                {book.title}
              </h1>
              <p className="text-base md:text-lg text-gray-400 font-medium">
                Yazar: <span className="text-gray-300 font-semibold">{book.author}</span>
              </p>
            </div>

            {/* Speficic Client Interactive part (pricing, buy, tabs) */}
            <BookDetailClient book={book} />
          </div>
        </div>

      </div>
    </div>
  );
}
