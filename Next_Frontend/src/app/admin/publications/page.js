"use client";

import AdminProtected from "@/components/admin/AdminProtected";
import AdminCrudPage from "@/components/admin/AdminCrudPage";
import { createPublication, deletePublication, listPublications, reorderPublications, togglePublicationPublished, updatePublication } from "@/lib/admin-api";

const emptyForm = {
  title: "",
  authors: "",
  journal: "",
  publicationYear: "",
  volume: "",
  issue: "",
  pages: "",
  abstractText: "",
  citation: "",
  doi: "",
  tags: "",
  originalPublicationUrl: "",
  pdfExternalUrl: "",
  slug: "",
  displayOrder: "0",
  published: true,
  pdfAssetId: "",
};

const fields = [
  { key: "title", label: "Title" },
  { key: "authors", label: "Authors" },
  { key: "journal", label: "Journal" },
  { key: "publicationYear", label: "Publication year", type: "number" },
  { key: "volume", label: "Volume" },
  { key: "issue", label: "Issue" },
  { key: "pages", label: "Pages" },
  { key: "abstractText", label: "Abstract", type: "textarea", rows: 5 },
  { key: "citation", label: "Citation", type: "textarea", rows: 4 },
  { key: "doi", label: "DOI" },
  { key: "tags", label: "Tags (comma-separated)", type: "textarea", rows: 2 },
  { key: "originalPublicationUrl", label: "Original publication URL" },
  { key: "pdfExternalUrl", label: "PDF URL" },
  { key: "slug", label: "Slug" },
  { key: "published", label: "Published", type: "checkbox" },
  { key: "pdfAssetId", label: "PDF asset", type: "file", accept: "application/pdf", uploadPrefix: "publication-pdf" },
];

const toForm = (item) => ({
  ...emptyForm,
  ...item,
  publicationYear: item.publicationYear ?? "",
  displayOrder: item.displayOrder ?? 0,
  tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
  pdfAssetId: item.pdfAssetId || "",
});

const toPayload = (form) => ({
  title: form.title,
  authors: form.authors || null,
  journal: form.journal || null,
  publicationYear: form.publicationYear === "" ? null : Number(form.publicationYear),
  volume: form.volume || null,
  issue: form.issue || null,
  pages: form.pages || null,
  abstractText: form.abstractText || null,
  citation: form.citation || null,
  doi: form.doi || null,
  tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
  originalPublicationUrl: form.originalPublicationUrl || null,
  pdfExternalUrl: form.pdfExternalUrl || null,
  displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
  published: Boolean(form.published),
  slug: form.slug || null,
  pdfAssetId: form.pdfAssetId || null,
});

export default function PublicationsPage() {
  return (
    <AdminProtected>
      <AdminCrudPage
        title="Publications"
        description="Manage publication records and tag filters."
        itemLabel="publication"
        loadItems={listPublications}
        saveItem={(id, payload) => (id ? updatePublication(id, payload) : createPublication(payload))}
        deleteItem={deletePublication}
        togglePublished={togglePublicationPublished}
        reorderItems={reorderPublications}
        fields={fields}
        emptyForm={emptyForm}
        toForm={toForm}
        toPayload={toPayload}
      />
    </AdminProtected>
  );
}
