"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if this is a fresh page load (not client-side navigation)
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const firstEntry = navEntries[0];
    const isReload = navEntries.length > 0 && firstEntry && (firstEntry.type === "reload" || firstEntry.type === "navigate");

    // Check sessionStorage to see if we've shown splash this session
    const hasShownSplash = sessionStorage.getItem("nova-splash-shown");

    if (!hasShownSplash || isReload) {
      setShow(true);
      sessionStorage.setItem("nova-splash-shown", "true");

      // Start fade out after animation completes
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1000);

      // Remove splash completely
      const removeTimer = setTimeout(() => {
        setShow(false);
      }, 1250);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Pulsating waves - starting from edge of circle */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-primary-500 shadow-[0_0_60px_20px_rgba(14,165,233,0.6)] animate-pulse-wave-1" />
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-primary-400 shadow-[0_0_50px_15px_rgba(56,189,248,0.5)] animate-pulse-wave-2" />
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-primary-300 shadow-[0_0_40px_10px_rgba(125,211,252,0.4)] animate-pulse-wave-3" />
      </div>

      {/* Black circle with Nova text */}
      <div className="relative z-10 animate-fade-in-scale">
        <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gray-950 flex items-center justify-center">
          <span className="text-5xl sm:text-7xl font-bold">
            <span className="font-black bg-gradient-to-br from-primary-300 via-primary-400 to-primary-600 bg-clip-text text-transparent">
              N
            </span>
            <span className="text-white">ova</span>
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-wave {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            transform: scale(6);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse-wave-1 {
          animation: pulse-wave 1s ease-out forwards;
        }

        .animate-pulse-wave-2 {
          animation: pulse-wave 1s ease-out 0.15s forwards;
        }

        .animate-pulse-wave-3 {
          animation: pulse-wave 1s ease-out 0.3s forwards;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
