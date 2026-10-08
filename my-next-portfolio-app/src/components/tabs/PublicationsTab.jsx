"use client";

import { useState, useMemo } from "react";

// Tags to suppress — redundant, too vague, abbreviations covered by full forms, etc.
const BLOCKED_TAGS = new Set([
  "research",
  "scig",
  "ivig",
  "allometry",           // "allometric scaling" already covers this
  "biologics",           // too broad
  "oncology",            // only tangentially relevant
  "neonatal pharmacology", // "pediatric pharmacokinetics" already covers neonatal scope
]);

// Normalise a raw tag string for dedup and display
function normaliseTag(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

const TAGS_PER_PAGE = 10;

export default function PublicationsTab({ publications = [], loading, error, onOpenAbstract, onOpenCite }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleTagCount, setVisibleTagCount] = useState(TAGS_PER_PAGE);

  // Extract unique categories, filtering out blocked tags
  const categories = useMemo(() => {
    const tagsMap = new Map(); // normalised → display form
    publications.forEach((pub) => {
      if (pub.tags) {
        pub.tags.forEach((t) => {
          const normalised = normaliseTag(t);
          if (normalised && !BLOCKED_TAGS.has(normalised) && !tagsMap.has(normalised)) {
            // Capitalise each word for display
            const display = normalised
              .split(/[-\s]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
            tagsMap.set(normalised, display);
          }
        });
      }
    });
    return Array.from(tagsMap.entries()); // [[normalised, display], …]
  }, [publications]);

  // How many tags are currently visible
  const visibleCategories = categories.slice(0, visibleTagCount);
  const hasMoreTags = visibleTagCount < categories.length;
  const hasLessTags = visibleTagCount > TAGS_PER_PAGE;

  // Filtered publications
  const filteredPubs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return publications.filter((pub) => {
      // Category match
      let matchesCategory = selectedCategory === "all";
      if (!matchesCategory) {
        matchesCategory = (pub.tags || []).some(
          (t) => normaliseTag(t) === selectedCategory
        );
      }

      // Search query match
      let matchesSearch = true;
      if (query) {
        const searchable = `${pub.title || ""} ${pub.authors || ""} ${pub.journal || ""} ${pub.text || ""}`.toLowerCase();
        matchesSearch = searchable.includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [publications, searchQuery, selectedCategory]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading publications...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight mb-2">
          Publications
        </h1>
        <p className="text-[14.5px] text-gray-600 leading-relaxed">
          This section presents my research publications, linked to their full texts and accompanying
          data. Additional information can be accessed by clicking on each publication.
        </p>
      </div>

      {/* Search — compact, full-width, fixed height */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, author, or topic…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-shadow"
        />
      </div>

      {/* Tag pills — below the search */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => {
            setSelectedCategory("all");
            setSearchQuery("");
          }}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            selectedCategory === "all"
              ? "font-semibold bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        {visibleCategories.map(([normalised, display]) => {
          const isActive = selectedCategory === normalised;
          return (
            <button
              key={normalised}
              onClick={() => setSelectedCategory(normalised)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                isActive
                  ? "font-semibold bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {display}
            </button>
          );
        })}

        {/* Show more / Show less toggle */}
        {hasMoreTags && (
          <button
            onClick={() => setVisibleTagCount((c) => c + TAGS_PER_PAGE)}
            className="px-2.5 py-1 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors font-medium"
          >
            + Show more
          </button>
        )}
        {hasLessTags && !hasMoreTags && (
          <button
            onClick={() => setVisibleTagCount(TAGS_PER_PAGE)}
            className="px-2.5 py-1 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors font-medium"
          >
            Show less
          </button>
        )}
      </div>

      {/* Publications Items */}
      <div className="space-y-6 pt-1 divide-y divide-gray-100">
        {filteredPubs.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No publications found.</p>
        ) : (
          filteredPubs.map((pub, index) => {
            const hasPdf = Boolean(pub.pdfLink && pub.pdfLink !== "#" && pub.pdfLink.trim() !== "");
            const origUrl = pub.originalLink || "#";
            const citation =
              pub.citation ||
              `${pub.authors || "Mahmood, I."} (${pub.journal || ""})`;

            return (
              <article
                key={pub.key}
                className={`pub-row pt-4 ${index === 0 ? "first:pt-0" : ""}`}
              >
                {/* Title linked to original publication */}
                <h3 className="text-[16px] font-semibold text-gray-900 hover:text-blue-700 leading-snug">
                  <a
                    href={origUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open original publication page"
                  >
                    {pub.title}
                  </a>
                </h3>

                {pub.authors && (
                  <p className="text-[13.5px] text-gray-600 mt-1">{pub.authors}</p>
                )}

                <p className="text-[13px] text-gray-500 italic mt-0.5">
                  {pub.journal}
                </p>

                <div className="mt-2 flex items-center space-x-3 text-xs">
                  {/* View PDF */}
                  {hasPdf && (
                    <a
                      href={pub.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owl-link font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View PDF
                    </a>
                  )}

                  {/* Abstract Modal trigger */}
                  <button
                    onClick={() => onOpenAbstract(pub)}
                    className="owl-link font-medium"
                  >
                    Abstract
                  </button>

                  {/* Cite Modal trigger */}
                  <button
                    onClick={() => onOpenCite(citation)}
                    className="owl-link font-medium"
                  >
                    Cite
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

