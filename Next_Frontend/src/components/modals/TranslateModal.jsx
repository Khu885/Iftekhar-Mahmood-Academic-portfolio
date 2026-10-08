"use client";

import { useEffect } from "react";

export default function TranslateModal({ isOpen, onClose, onSelectLanguage }) {
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

  const languages = [
    { code: "en", label: "English (Original)" },
    { code: "it", label: "Italiano (Italian)" },
    { code: "es", label: "Español (Spanish)" },
    { code: "fr", label: "Français (French)" },
    { code: "de", label: "Deutsch (German)" },
    { code: "ja", label: "日本語 (Japanese)" },
    { code: "zh", label: "中文 (Chinese)" },
    { code: "ur", label: "اردو (Urdu)" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-xs w-full p-6 shadow-xl border border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base font-bold text-gray-900 mb-1">Translate to</h3>
        <p className="text-xs text-gray-500 mb-3">Select language:</p>

        <div className="max-h-56 overflow-y-auto space-y-1 text-xs text-gray-700 pr-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelectLanguage(lang.label);
                onClose();
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
