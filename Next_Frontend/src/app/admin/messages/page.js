"use client";

import { useEffect, useState, useMemo } from "react";
import AdminProtected from "@/components/admin/AdminProtected";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { listMessages, markMessageRead, deleteMessage } from "@/lib/admin-api";

function formatTimestamp(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return isoString;
  }
}

function formatFullDateTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copied, setCopied] = useState(false);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await listMessages();
      const list = Array.isArray(data) ? data : [];
      setMessages(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load messages", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (message, e) => {
    if (e) e.stopPropagation();
    const nextRead = !message.read;
    try {
      const updated = await markMessageRead(message.id, nextRead);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: updated.read } : m))
      );
      showToast(nextRead ? "Marked as read" : "Marked as unread");
    } catch (err) {
      showToast(err?.message || "Failed to update status", "error");
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      try {
        await markMessageRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch {
        // silent fail
      }
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Message deleted");
      if (selectedId === id) {
        const remaining = messages.filter((m) => m.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      showToast(err?.message || "Failed to delete message", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  const readCount = useMemo(() => messages.filter((m) => m.read).length, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "read" && !m.read) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesEmail = m.email?.toLowerCase().includes(q);
        const matchesMsg = m.message?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesMsg) return false;
      }
      return true;
    });
  }, [messages, filter, search]);

  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId]
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === "error"
              ? "bg-rose-600 text-white shadow-rose-500/20"
              : "bg-gray-900 text-white shadow-black/20"
          }`}
        >
          {toast.type === "error" ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Review and respond to client inquiries sent via the portfolio contact form."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadMessages(false)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
              title="Refresh messages"
            >
              <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Received</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{messages.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Unread Inquiries</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">{unreadCount}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <span className="flex h-3 w-3 rounded-full bg-rose-500"></span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Read / Archived</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{readCount}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
        {/* Controls Bar: Filter tabs + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 p-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-gray-100/80 p-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "unread" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "read" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Read ({readCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <svg
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, email, text..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-1.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Messages List Column */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-gray-400">
                <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-3 text-xs font-medium">Loading inquiries...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-gray-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700">No messages found</p>
                <p className="mt-1 text-xs text-gray-400">
                  {search ? "No results match your search keyword." : "You have no messages under this tab."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-[620px]">
                {filteredMessages.map((msg) => {
                  const isSelected = msg.id === selectedId;
                  const isUnread = !msg.read;

                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`group relative flex cursor-pointer items-start gap-3 p-4 transition-colors ${
                        isSelected
                          ? "bg-indigo-50/70 border-l-4 border-indigo-600"
                          : isUnread
                          ? "bg-white hover:bg-gray-50 font-medium"
                          : "bg-gray-50/40 hover:bg-gray-50 opacity-90"
                      }`}
                    >
                      {/* Unread indicator dot */}
                      <div className="pt-1 flex-shrink-0">
                        <span
                          className={`block h-2 w-2 rounded-full ${
                            isUnread ? "bg-rose-500 shadow-sm shadow-rose-300" : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`truncate text-xs ${
                              isUnread ? "font-bold text-gray-950" : "font-medium text-gray-700"
                            }`}
                          >
                            {msg.name}
                          </p>
                          <span className="flex-shrink-0 text-[10px] text-gray-400">
                            {formatTimestamp(msg.createdAt)}
                          </span>
                        </div>

                        <p className="truncate text-[11px] text-gray-500 mt-0.5">{msg.email}</p>

                        <p
                          className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
                            isUnread ? "text-gray-800 font-normal" : "text-gray-500 font-light"
                          }`}
                        >
                          {msg.message}
                        </p>
                      </div>

                      {/* Quick delete icon button on hover */}
                      <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 transition"
                        title="Delete message"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Detail Column */}
          <div className="lg:col-span-7 flex flex-col bg-white">
            {selectedMessage ? (
              <div className="flex flex-col h-full p-6">
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-start gap-3.5">
                    {/* Avatar */}
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white shadow-sm"
                      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                    >
                      {selectedMessage.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-gray-950">{selectedMessage.name}</h2>
                        {!selectedMessage.read ? (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-200">
                            Unread
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                            Read
                          </span>
                        )}
                      </div>

                      {/* Email + Copy button */}
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                        <span>{selectedMessage.email}</span>
                        <button
                          onClick={() => handleCopyEmail(selectedMessage.email)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Received on {formatFullDateTime(selectedMessage.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                    >
                      {selectedMessage.read ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                          Mark Unread
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Read
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={deletingId === selectedMessage.id}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 active:scale-95 transition disabled:opacity-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="flex-1 py-6">
                  <div className="rounded-2xl bg-gray-50/80 p-5 border border-gray-100 leading-relaxed text-gray-800 text-sm whitespace-pre-wrap selection:bg-indigo-100">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Footer Banner */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Direct Response</p>
                    <p className="text-[11px] text-gray-500">
                      Open your default mail client to reply directly to {selectedMessage.name}.
                    </p>
                  </div>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      "Re: Inquiry - Mahmood Clinical Pharmacology"
                    )}&body=${encodeURIComponent(
                      `\n\n--- Original message from ${selectedMessage.name} on ${formatFullDateTime(
                        selectedMessage.createdAt
                      )} ---\n${selectedMessage.message}`
                    )}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
                  >
                    <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-gray-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700">Select a message</p>
                <p className="mt-1 text-xs text-gray-400">
                  Choose a message from the list on the left to read its full content and reply.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <AdminProtected>
      <MessagesInbox />
    </AdminProtected>
  );
}
