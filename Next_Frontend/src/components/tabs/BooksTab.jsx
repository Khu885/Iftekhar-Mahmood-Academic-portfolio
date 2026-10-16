"use client";

import { useState } from "react";
import Image from "next/image";

function BookCoverImage({ src, alt }) {
  const [error, setError] = useState(false);
  const normalizedSrc = src ? src.replace(/^\.\//, "/") : "/assets/images/banner-biology.svg";

  return (
    <Image
      src={error ? "/assets/images/banner-biology.svg" : normalizedSrc}
      alt={alt}
      fill
      unoptimized
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
}

export default function BooksTab({ books = [], loading, error, onOpenBookPreview }) {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading books...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight mb-2">
          Books
        </h1>
        <p className="text-[14.5px] text-gray-600 leading-relaxed">
          Textbooks authored and edited by Dr. Iftekhar Mahmood covering clinical
          pharmacology, allometry, and therapeutic proteins.
        </p>
      </div>

      <div id="books-items-container" className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Book Cover Preview Thumbnail */}
              <div
                className="shrink-0 cursor-pointer group"
                onClick={() => onOpenBookPreview(book)}
                title="Click to preview cover"
              >
                <div className="w-24 sm:w-28 h-36 sm:h-40 rounded shadow-md border border-gray-200 overflow-hidden bg-slate-900 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all relative">
                  <BookCoverImage src={book.preview} alt={book.title} />
                </div>
                <span className="block text-[11px] text-center text-blue-600 font-medium mt-1.5 group-hover:underline">
                  Preview
                </span>
              </div>

              {/* Book Metadata */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3
                    className="text-[15px] font-bold text-gray-900 leading-snug cursor-pointer hover:text-blue-700 transition-colors"
                    onClick={() => onOpenBookPreview(book)}
                  >
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-[11px] text-gray-500 font-medium mb-1">
                      {book.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {book.publisher} &bull; {book.year}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                    {book.description}
                  </p>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <span>
                    Author:{" "}
                    <strong className="text-gray-700 font-medium">
                      {book.author}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Bottom Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenBookPreview(book)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors"
                >
                  Preview Details
                </button>
                {book.pdfLink && (
                  <a
                    href={book.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-medium transition-colors"
                    title="View or download PDF"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    PDF
                  </a>
                )}
              </div>
              {book.link && book.link !== "#" && (
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="owl-link font-medium"
                >
                  Read &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
