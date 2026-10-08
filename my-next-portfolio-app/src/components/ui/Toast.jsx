"use client";

export default function Toast({ message, visible }) {
  if (!visible || !message) return null;

  return (
    <div
      id="toast"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg text-xs z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
    >
      <span>{message}</span>
    </div>
  );
}
