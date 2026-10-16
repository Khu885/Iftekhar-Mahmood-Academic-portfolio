"use client";

export default function CvTab({ cv, loading, error }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading CV...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!cv) {
    return <p className="text-sm text-gray-500">No CV content available.</p>;
  }

  const sections = cv.sections || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
            {cv.title || "Curriculum Vitae"}
          </h1>
          <p className="text-[13px] sm:text-[13.5px] text-gray-500 mt-1">
            {cv.externalUrl ? `${cv.externalUrl} • ` : ""}{cv.description || "Academic background, FDA appointments, and credentials."}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="self-start sm:self-auto text-xs px-3.5 py-1.5 border border-gray-300 rounded hover:bg-gray-50 font-medium transition-colors cursor-pointer"
        >
          Print CV
        </button>
      </div>

      <div className="space-y-6 pt-2">
        {sections.map((section) => (
          <div key={section.id || section.title}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-3">
              {section.title}
            </h3>
            <div className="space-y-4 text-[13.5px] sm:text-[14px]">
              {(section.entries || []).map((entry, idx) => (
                <div key={entry.id || idx}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-4 font-semibold text-gray-900">
                    <span>{entry.heading || entry.organization || "Untitled"}</span>
                    {(entry.startDate || entry.endDate) && (
                      <span className="font-normal text-xs text-gray-500 shrink-0">
                        {entry.startDate || ""}{entry.endDate ? ` – ${entry.endDate}` : ""}
                      </span>
                    )}
                  </div>
                  {(entry.organization || entry.location) && (
                    <p className="text-xs text-gray-600">
                      {entry.organization}
                      {entry.organization && entry.location ? " • " : ""}
                      {entry.location}
                    </p>
                  )}
                  {entry.description && (
                    <p className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
