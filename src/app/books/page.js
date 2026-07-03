import CatalogPage from "../../components/CatalogPage";
import { getAllBooks } from "@/lib/booksDb";

export const revalidate = 0; // Disable static caching so admin changes are immediately visible

async function getBooks() {
  return getAllBooks();
}

export default async function Page() {
  const books = await getBooks();

  return (
    <div className="bg-[#0a0a0c] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#121216] to-[#0a0a0c] border-b border-[#2a2a35]/50 py-12 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase">
            Tefekkür Meclisi Kitap Evi
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-serif text-white tracking-wide">
            TÜM ESERLER
          </h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Manevi seyahat rehberlerinden, İslam tarihi ve klasik edebi eserlere kadar uzanan geniş kütüphanemizde arama yapabilirsiniz.
          </p>
        </div>
      </section>

      {/* Catalog Main Component */}
      <CatalogPage initialBooks={books} />
    </div>
  );
}
