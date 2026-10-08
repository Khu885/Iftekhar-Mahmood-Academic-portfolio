"use client";

import { useEffect } from "react";

export default function PrivacyModal({ isOpen, onClose }) {
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
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base font-bold text-gray-900 mb-2">Privacy Policy</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          This website is for informational academic and professional purposes. No personal data is tracked or sold.
          Direct messages sent via the contact form are stored solely to respond to consulting inquiries.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 text-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
