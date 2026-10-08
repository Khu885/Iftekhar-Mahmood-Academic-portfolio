"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function QrModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-xs w-full p-6 text-center shadow-xl border border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base font-bold text-gray-900 mb-1">QR Code</h3>
        <p className="text-xs text-gray-500 mb-3">
          Scan to visit Dr. Iftekhar Mahmood&apos;s profile.
        </p>

        <div className="flex justify-center p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          <Image
            src="/assets/images/qr-code.svg"
            alt="QR Code"
            width={144}
            height={144}
            className="w-36 h-36"
          />
        </div>

        <p className="text-[11px] text-gray-400 font-mono break-all mb-4">
          https://www.linkedin.com/in/iftekhar-mahmood-78981b192/
        </p>

        <button
          onClick={onClose}
          className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
