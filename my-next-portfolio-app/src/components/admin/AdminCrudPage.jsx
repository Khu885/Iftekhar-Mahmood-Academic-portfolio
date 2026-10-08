"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { uploadFile } from "@/lib/admin-api";
import AdminPageHeader from "./AdminPageHeader";

export default function AdminCrudPage({
  title,
  description,
  loadItems,
  saveItem,
  deleteItem,
  togglePublished,
  reorderItems,
  fields,
  emptyForm,
  toForm,
  toPayload,
  itemLabel = "item",
  toggleOnLabel = "Unpublish",
  toggleOffLabel = "Publish",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Error ref for auto-scrolling
  const errorRef = useRef(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNodeRef = useRef(null);

  // Automatically scroll up when an error occurs
  useEffect(() => {
    if (error) {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [error]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loadItems();
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to load ${itemLabel}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setForm(toForm(selectedItem));
    } else {
      setForm(emptyForm);
    }
  }, [selectedItem]);

  const startCreate = () => {
    setSelectedId(null);
    setForm(emptyForm);
  };

  const editItem = (item) => {
    setSelectedId(item.id);
    setForm(toForm(item));
  };

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleUpload = async (field, file) => {
    if (!file) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await uploadFile(file, field.uploadPrefix || "asset");
      updateField(field.key, result.fileId);
      setMessage(`${field.label} uploaded`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to upload ${field.label}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      if (form.title !== undefined && !form.title?.trim()) {
        throw new Error("Title is required. Please enter a title.");
      }
      if (form.slug !== undefined && !form.slug?.trim()) {
        throw new Error("Slug is required. Please enter a unique slug.");
      }
      const payload = toPayload(form);
      await saveItem(selectedId, payload);
      setMessage(`${itemLabel} saved successfully`);
      await refresh();
      startCreate();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : `Unable to save ${itemLabel}`;
      setError(errorMsg);
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete this ${itemLabel}?`)) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await deleteItem(item.id);
      setMessage(`${itemLabel} deleted`);
      await refresh();
      if (selectedId === item.id) {
        startCreate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to delete ${itemLabel}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await togglePublished(item.id, !item.published);
      setMessage(`${itemLabel} visibility updated`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to update ${itemLabel}`);
    } finally {
      setSaving(false);
    }
  };

  // Reorder & persist order to backend
  const persistOrder = async (reorderedItems) => {
    if (!reorderItems) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const orderedIds = reorderedItems.map((item) => item.id);
      await reorderItems(orderedIds);
      setMessage("Order updated and saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save new order");
    } finally {
      setSaving(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setItems(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
    persistOrder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Step Move Up / Down
  const handleMoveStep = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setItems(reordered);
    persistOrder(reordered);
  };

  // 1-Click Sort by Latest Year First
  const handleSortLatestFirst = () => {
    const sorted = [...items].sort((a, b) => {
      const yearA = Number(a.publicationYear || a.year || 0);
      const yearB = Number(b.publicationYear || b.year || 0);
      if (yearB !== yearA) return yearB - yearA;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    setItems(sorted);
    persistOrder(sorted);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content editor"
        title={title}
        description={description}
        actions={[
          <button
            key="refresh"
            onClick={refresh}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Refresh
          </button>,

        ]}
      />

      {message && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700 animate-in fade-in">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-green-600 hover:text-green-800 font-bold ml-2">×</button>
        </div>
      )}
      {error && (
        <div
          ref={errorRef}
          className="flex items-center justify-between rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-red-600 hover:text-red-900 font-bold ml-2 text-lg leading-none">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Drag & Drop List (50%) */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-700">
                Papers ({items.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag and drop to rearrange order. Changes save automatically.
              </p>
            </div>
            {reorderItems && items.length > 1 && (
              <button
                onClick={handleSortLatestFirst}
                disabled={saving || loading}
                title="Automatically sort with the newest publication year at the top"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all shadow-sm"
              >
                <span>📅</span>
                <span>Sort Latest First</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm animate-pulse"
                >
                  <div className="h-4 w-4 rounded bg-gray-200" />
                  <div className="h-4 w-10 rounded bg-gray-200" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="h-4 w-4/5 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                  <div className="h-6 w-14 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No {itemLabel}s found. Click &quot;New {itemLabel}&quot; to add one.</div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item, index) => {
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index && draggedIndex !== index;
                const year = item.publicationYear || item.year;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group relative flex items-center gap-3 rounded-xl border p-3.5 transition-all select-none ${isDragging
                      ? "opacity-30 border-dashed border-gray-400 bg-gray-50 scale-[0.98]"
                      : isDragOver
                        ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-400/40"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                  >
                    {/* Drag Handle & Ordering controls */}
                    <div
                      className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 group-hover:text-gray-600 transition-colors px-1"
                      title="Click and drag to reorder"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                      </svg>
                    </div>

                    {/* Step buttons for quick accessible up/down */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStep(index, -1);
                        }}
                        disabled={index === 0 || saving}
                        title="Move up"
                        className="text-[10px] leading-none px-1 py-0.5 text-gray-400 hover:text-gray-800 disabled:opacity-20 hover:bg-gray-100 rounded"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStep(index, 1);
                        }}
                        disabled={index === items.length - 1 || saving}
                        title="Move down"
                        className="text-[10px] leading-none px-1 py-0.5 text-gray-400 hover:text-gray-800 disabled:opacity-20 hover:bg-gray-100 rounded"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Position Badge */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-mono text-xs font-semibold text-gray-600">
                      {index + 1}
                    </div>

                    {/* Item Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-gray-900 truncate block" title={item.title || item.slug}>
                          {item.title || item.slug}
                        </span>
                        {year && (
                          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            {year}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 min-w-0">
                        <span className="truncate block">{item.slug}</span>
                        <span>•</span>
                        <span className={item.published ? "text-green-600 font-medium shrink-0" : "text-amber-600 font-medium shrink-0"}>
                          {item.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex shrink-0 items-center gap-1.5 text-xs">
                      <button
                        onClick={() => editItem(item)}
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(item)}
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        {item.published ? toggleOnLabel : toggleOffLabel}
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-200 px-2.5 py-1.5 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Create / Edit Form (50%) */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-700">
              {selectedId ? `Edit ${itemLabel}` : `Create ${itemLabel}`}
            </h2>
            {selectedId && (
              <button
                onClick={startCreate}
                className="text-xs text-gray-500 hover:text-gray-800 underline"
              >
                Switch to new
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-in fade-in">
              <span className="shrink-0 text-sm">⚠️</span>
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">{field.label}</span>
                {field.type === "list" ? (
                  <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50/60 p-3">
                    {(() => {
                      const list = Array.isArray(form[field.key])
                        ? form[field.key]
                        : typeof form[field.key] === "string" && form[field.key].trim()
                        ? form[field.key].split("\n").map((s) => s.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean)
                        : [];

                      return (
                        <>
                          {list.length === 0 ? (
                            <p className="py-2 text-center text-xs text-gray-400">
                              No key contributions added yet. Click &ldquo;+ Add Contribution&rdquo; below.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {list.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                    {idx + 1}
                                  </span>
                                  <textarea
                                    rows={2}
                                    value={item}
                                    onChange={(e) => {
                                      const next = [...list];
                                      next[idx] = e.target.value;
                                      updateField(field.key, next);
                                    }}
                                    placeholder={field.placeholder || `Contribution #${idx + 1}...`}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = list.filter((_, i) => i !== idx);
                                      updateField(field.key, next);
                                    }}
                                    className="mt-1 rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                    title="Delete contribution"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              updateField(field.key, [...list, ""]);
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:border-indigo-500 hover:text-indigo-600 active:scale-[0.99] transition shadow-xs"
                          >
                            <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            + Add Key Contribution
                          </button>
                        </>
                      );
                    })()}
                  </div>
                ) : field.type === "textarea" || field.type === "json" ? (
                  <textarea
                    rows={field.rows || 4}
                    value={form[field.key] || ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`field-${field.key}`}
                      checked={Boolean(form[field.key])}
                      onChange={(event) => updateField(field.key, event.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <label htmlFor={`field-${field.key}`} className="text-sm text-gray-600 cursor-pointer">
                      Visible to public
                    </label>
                  </div>
                ) : field.type === "file" ? (
                  <div className="space-y-2">
                    {form[field.key] ? (
                      <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">File attached</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateField(field.key, "")}
                          className="text-red-600 hover:text-red-800 font-semibold underline text-xs ml-2"
                          title="Remove attached file"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No file uploaded yet (optional)</p>
                    )}
                    <input
                      type="file"
                      accept={field.accept}
                      onChange={(event) => handleUpload(field, event.target.files && event.target.files[0])}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.key] ?? ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-2.5 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 transition-all shadow-md shadow-indigo-500/20"
              >
                {saving ? "Saving..." : selectedId ? `Update ${itemLabel}` : `Save ${itemLabel}`}
              </button>
              <button
                onClick={startCreate}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
