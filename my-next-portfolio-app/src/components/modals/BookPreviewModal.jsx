"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BookPreviewModal({ isOpen, onClose, book }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [book]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !book) return null;

  const previewSrc = book.preview ? book.preview.replace(/^\.\//, "/") : "/assets/images/banner-biology.svg";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Large Cover Preview */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="w-44 sm:w-52 h-64 sm:h-76 rounded-lg shadow-xl border border-gray-200 overflow-hidden bg-slate-950 relative">
              <Image
                src={imgError ? "/assets/images/banner-biology.svg" : previewSrc}
                alt={book.title}
                fill
                unoptimized
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            {book.isbn && (
              <p className="text-[11px] text-gray-400 font-mono text-center mt-2">
                ISBN: {book.isbn}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Textbook &bull; {book.year}
            </span>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {book.title}
            </h2>
            {book.subtitle && (
              <p className="text-xs text-gray-500 font-medium -mt-1">
                {book.subtitle}
              </p>
            )}

            <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded border border-gray-200">
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Publisher:</strong> {book.publisher}
              </p>
              <p>
                <strong>Year:</strong> {book.year}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Book Synopsis
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-white border border-gray-100 p-3 rounded shadow-xs max-h-48 overflow-y-auto">
                {book.description}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-end">
              {book.pdfLink && (
                <a
                  href={book.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  title="View or download PDF"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  View PDF
                </a>
              )}
              {book.link && book.link !== "#" && (
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  View on Goodreads
                </a>
              )}
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
