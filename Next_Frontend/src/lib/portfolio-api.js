const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function buildUrl(path) {
  if (!API_BASE_URL) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function fetchJson(path) {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload?.data;
}

export function getPublicBookCoverUrl(slug) {
  return buildUrl(`/api/public/books/${encodeURIComponent(slug)}/cover`);
}

export async function loadPortfolioContent() {
  const [books, publications, projects, cv] = await Promise.all([
    fetchJson("/api/public/books"),
    fetchJson("/api/public/publications"),
    fetchJson("/api/public/projects"),
    fetchJson("/api/public/cv"),
  ]);

  return {
    books: (books || []).map((book) => ({
      ...book,
      year: book.publicationYear,
      link: book.externalBookUrl || "#",
      preview: book.coverAssetId
        ? getPublicBookCoverUrl(book.slug)
        : `/assets/images/books/${book.slug}.svg`,
      pdfLink: book.pdfExternalUrl || (book.pdfAssetId ? buildUrl(`/api/public/books/${encodeURIComponent(book.slug)}/pdf`) : null),
    })),
    publications: (publications || []).map((publication) => ({
      ...publication,
      text: publication.abstractText,
      originalLink: publication.originalPublicationUrl || "#",
      pdfLink: publication.pdfAssetId
        ? buildUrl(`/api/public/publications/${encodeURIComponent(publication.slug)}/pdf`)
        : null,
      tags: Array.isArray(publication.tags) ? publication.tags : [],
    })),
    projects: (projects || []).map((project) => ({
      ...project,
      highlights: (project.highlights || []).map((highlight) => (
        typeof highlight === "string" ? highlight : highlight.highlightText
      )),
    })),
    cv,
  };
}

export async function sendContactMessage(payload) {
  const response = await fetch(buildUrl("/api/public/contact"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Failed to send message (${response.status})`);
  }

  return data?.data;
}
