"use client";

import React, { useState } from "react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = "905383999666";
  const message = encodeURIComponent(
    "Selamün Aleyküm, Tefekkür Meclisi Kitap Evi sitemiz/turlarınız hakkında bilgi alabilir miyim?"
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip text panel */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`mr-3 px-4 py-2 bg-[#121216]/95 border border-[#d4af37]/35 text-[#d4af37] text-xs font-semibold tracking-wider rounded-lg shadow-xl backdrop-blur-sm transition-all duration-300 transform flex items-center space-x-2 ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
        <span>WHATSAPP DANIŞMA HATTI</span>
      </a>

      {/* Floating Circular Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 relative group"
        aria-label="WhatsApp Support"
        id="whatsapp-floating-btn"
      >
        {/* Pulsing glow ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10 group-hover:opacity-50" />

        {/* WhatsApp Icon */}
        <svg
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.588 2.025 14.116.999 11.49.999c-5.444 0-9.866 4.372-9.87 9.802 0 1.63.45 3.22 1.302 4.62l-1.024 3.736 3.841-1.003zM16.71 13.9c-.302-.15-1.79-.882-2.07-.985-.278-.102-.48-.153-.68.15-.201.303-.78.985-.957 1.186-.177.201-.353.226-.655.075-3.022-1.5-3.73-2.484-4.238-3.359-.148-.255-.015-.393.113-.52.115-.115.252-.301.378-.452.128-.151.171-.252.257-.423.086-.171.043-.322-.021-.473-.065-.15-.68-1.637-.932-2.247-.246-.59-.496-.51-.68-.52-.178-.009-.382-.01-.587-.01-.205 0-.537.076-.818.384-.282.308-1.077 1.051-1.077 2.561 0 1.51 1.099 2.97 1.253 3.17.153.2 2.164 3.298 5.24 4.621.733.313 1.304.5 1.748.641.736.233 1.408.2 1.939.121.593-.088 1.791-.73 2.043-1.435.253-.704.253-1.307.177-1.435-.077-.127-.282-.202-.583-.353z" />
        </svg>
      </a>
    </div>
  );
}
