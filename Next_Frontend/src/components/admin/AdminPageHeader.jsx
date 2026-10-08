"use client";

export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div
      className="rounded-2xl bg-white px-7 py-6 shadow-sm"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {eyebrow && (
            <span
              className="inline-block rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ backgroundColor: "#f0f4ff", color: "#6366f1" }}
            >
              {eyebrow}
            </span>
          )}
          <h1 className="mt-2 text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
            {title}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
            {description}
          </p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
