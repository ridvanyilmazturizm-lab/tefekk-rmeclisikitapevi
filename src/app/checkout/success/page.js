"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid") || "RY-DEFAULT";
  const method = searchParams.get("method") || "paytr";

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-8 animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 bg-green-950/20 border border-[#d4af37]/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#d4af37]/5">
        <svg
          className="w-10 h-10 text-[#d4af37]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black font-serif text-white tracking-wide">
          SİPARİŞİNİZ <span className="text-gold">ALINDI</span>
        </h1>
        <p className="text-sm text-gray-400">
          Tefekkür Meclisi Kitap Evi'ni tercih ettiğiniz için teşekkür ederiz. Siparişiniz başarıyla sisteme kaydedilmiştir.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="glass-card-gold p-6 border border-[#d4af37]/25 rounded-xl space-y-4 max-w-lg mx-auto text-left text-xs">
        <div className="flex justify-between border-b border-[#2a2a35] pb-3">
          <span className="text-gray-500">Sipariş Referansı:</span>
          <span className="font-mono font-bold text-white tracking-wider">{oid}</span>
        </div>
        
        <div className="flex justify-between border-b border-[#2a2a35] pb-3">
          <span className="text-gray-500">Ödeme Yöntemi:</span>
          <span className="font-semibold text-gray-200">
            {method === "paytr" && "PayTR Kredi Kartı"}
            {method === "havale" && "Banka Havalesi / EFT"}
            {method === "cod" && "Kapıda Ödeme"}
          </span>
        </div>

        {/* Dynamic Payment Directions */}
        <div className="pt-2 text-gray-300 leading-relaxed space-y-2">
          {method === "paytr" && (
            <p>
              ✓ PayTR güvenli ödemeniz başarıyla tamamlandı. Siparişiniz kargolanmak üzere hazırlık departmanına yönlendirilmiştir. Takip kodu e-posta adresinize gönderilecektir.
            </p>
          )}

          {method === "havale" && (
            <div className="space-y-2 bg-[#1e1d18] border border-[#d4af37]/20 p-3.5 rounded-lg text-[11px]">
              <span className="text-[#d4af37] font-bold block uppercase tracking-wider">Önemli İşlem Adımı:</span>
              <span>
                Lütfen banka hesabımıza havale gönderirken, açıklama kısmına yalnızca yukarıdaki sipariş referansı olan <strong className="text-white font-mono font-bold">{oid}</strong> kodunu ekleyin. Havaleniz tarafımıza ulaştığında siparişiniz işleme alınacaktır.
              </span>
            </div>
          )}

          {method === "cod" && (
            <p>
              ✓ Siparişiniz kapıda ödeme seçeneği ile onaylanmıştır. Kargo görevlisi teslimat yaparken nakit veya kredi kartıyla tahsilat yapacaktır.
            </p>
          )}
        </div>
      </div>

      {/* Contact information support */}
      <div className="text-xs text-gray-500 max-w-md mx-auto space-y-2">
        <p>Herhangi bir sorunuzda Bursa Osmangazi acentemiz ile iletişime geçebilirsiniz.</p>
        <div className="flex justify-center space-x-6 text-[#d4af37] font-semibold">
          <span>Hattımız: 0538 399 96 66</span>
          <a
            href="https://www.instagram.com/ridvanyilmazturizm/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram: @ridvanyilmazturizm
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 flex justify-center space-x-4">
        <Link
          href="/"
          className="px-6 py-3 bg-gold-gradient text-[#0a0a0c] text-xs font-bold tracking-widest rounded-lg hover:bg-none hover:bg-[#f3e5ab] transition-all shadow"
        >
          ANASAYFAYA DÖN
        </Link>
        <Link
          href="/books"
          className="px-6 py-3 bg-[#18181f] border border-[#2a2a35] text-gray-300 text-xs font-bold tracking-widest rounded-lg hover:border-[#d4af37] hover:text-white transition-all"
        >
          ALIŞVERİŞE DEVAM ET
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-[#0a0a0c] min-h-screen py-12 px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center text-xs text-gray-500 animate-pulse">
            Sipariş detayları yükleniyor...
          </div>
        }
      >
        <SuccessPageContent />
      </Suspense>
    </div>
  );
}
