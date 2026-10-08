"use client";

import { useEffect } from "react";

export default function CiteModal({ isOpen, onClose, citation, onCopySuccess }) {
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation || "");
      onCopySuccess("Citation copied to clipboard");
    } catch {
      // Fallback
      const temp = document.createElement("textarea");
      document.body.appendChild(temp);
      temp.value = citation || "";
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      onCopySuccess("Citation copied to clipboard");
    }
    onClose();
  };

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

        <h3 className="text-base font-bold text-gray-900 mb-1">Cite Publication</h3>
        <p className="text-xs text-gray-500 mb-3">Copy standard reference:</p>

        <div
          id="cite-box"
          className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 font-mono mb-4 select-all leading-relaxed break-words"
        >
          {citation}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
          >
            Copy Citation
          </button>
        </div>
      </div>
    </div>
  );
}
