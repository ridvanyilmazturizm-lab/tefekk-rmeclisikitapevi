"use client";

import React, { useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !videoRef.current.muted;
      videoRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  };

  return (
    <div className="w-full max-w-[260px] md:max-w-[290px] aspect-[9/16] rounded-[2.5rem] border-4 border-[#2a2a35] hover:border-[#d4af37]/50 bg-black p-1 shadow-2xl overflow-hidden relative group transition-all duration-300">
      {/* Autoplay Loop Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-[2rem]"
      >
        <source src="/evet_isterim.mp4" type="video/mp4" />
      </video>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Floating Speaker Control Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-10 p-2.5 bg-black/70 hover:bg-black/90 text-[#f3f4f6] hover:text-[#d4af37] rounded-full border border-[#2a2a35] transition-all shadow-lg backdrop-blur-sm focus:outline-none flex items-center justify-center cursor-pointer scale-100 hover:scale-105 active:scale-95"
        title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
        id="hero-mute-toggle"
      >
        {isMuted ? (
          /* Muted Speaker Icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          /* Unmuted Speaker Icon with waves */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
