"use client";

import { useEffect } from "react";

export default function AbstractModal({ isOpen, onClose, data }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const rawPdfUrl = data.pdfLink || data.pdf;
  const hasPdf = Boolean(rawPdfUrl && rawPdfUrl !== "#" && rawPdfUrl.trim() !== "");
  const pdfUrl = hasPdf ? rawPdfUrl : null;
  const origUrl = data.originalLink || data.url || data.link || "#";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Abstract
          </span>
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            <a
              href={origUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              {data.title}
            </a>
          </h3>
          <p className="text-xs text-gray-500 italic mt-0.5 mb-3">{data.journal}</p>
          <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border border-gray-200 mb-4 whitespace-pre-line">
            {data.text}
          </p>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              {hasPdf && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                >
                  View PDF
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
