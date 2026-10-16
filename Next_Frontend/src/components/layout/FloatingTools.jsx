"use client";

import { useState, useEffect, useRef } from "react";

export default function FloatingTools({ onOpenModal, onToggleTextOnly }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      {/* Floating Tools Button — hidden on tiny phones, visible on sm+ */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="floating-tools-btn hidden sm:block"
        aria-label="Tools"
      >
        tools
      </button>

      {/* Tools Quick Popover */}
      {isOpen && (
        <div
          id="tools-popover"
          className="fixed bottom-14 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 z-50 text-xs w-40 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={() => {
              onOpenModal("qr");
              setIsOpen(false);
            }}
            className="block w-full text-left px-2.5 py-1.5 rounded hover:bg-gray-100 text-gray-800 transition-colors"
          >
            QR Code
          </button>
          <button
            onClick={() => {
              onToggleTextOnly();
              setIsOpen(false);
            }}
            className="block w-full text-left px-2.5 py-1.5 rounded hover:bg-gray-100 text-gray-800 transition-colors"
          >
            Text Only
          </button>
        </div>
      )}
    </div>
  );
}
