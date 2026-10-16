"use client";

export default function Footer({ onOpenModal, onShare, onToggleTextOnly }) {
  return (
    <footer className="w-full border-t border-gray-100 py-6 text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
          <button
            onClick={onShare}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Share
          </button>
          <span>&bull;</span>
          <span>&copy; 2026 Iftekhar Mahmood</span>
          <span>&bull;</span>
          <button
            onClick={() => onOpenModal("privacy")}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-xs text-gray-400">
          <span>Tools:</span>
          <button
            onClick={() => onOpenModal("qr")}
            className="hover:text-black transition-colors text-gray-500 cursor-pointer"
          >
            QR Code
          </button>
          <button
            onClick={onToggleTextOnly}
            className="hover:text-black transition-colors text-gray-500 cursor-pointer"
          >
            Text Only
          </button>
          <button
            onClick={() => onOpenModal("translate")}
            className="hover:text-black transition-colors text-gray-500 cursor-pointer"
          >
            Translate
          </button>
        </div>
      </div>
    </footer>
  );
}
