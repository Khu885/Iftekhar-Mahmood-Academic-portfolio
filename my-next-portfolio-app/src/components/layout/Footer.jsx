"use client";

export default function Footer({ onOpenModal, onShare, onToggleTextOnly }) {
  return (
    <footer className="w-full border-t border-gray-100 py-6 text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={onShare}
            className="hover:text-black transition-colors"
          >
            Share
          </button>
          <span>&bull;</span>
          <span>&copy; 2026 Iftekhar Mahmood</span>
          <span>&bull;</span>
          <button
            onClick={() => onOpenModal("privacy")}
            className="hover:text-black transition-colors"
          >
            Privacy Policy
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <span>Tools:</span>
          <button
            onClick={() => onOpenModal("qr")}
            className="hover:text-black transition-colors text-gray-500"
          >
            QR Code
          </button>
          <button
            onClick={onToggleTextOnly}
            className="hover:text-black transition-colors text-gray-500"
          >
            Text Only
          </button>
          <button
            onClick={() => onOpenModal("translate")}
            className="hover:text-black transition-colors text-gray-500"
          >
            Translate
          </button>
        </div>
      </div>
    </footer>
  );
}
