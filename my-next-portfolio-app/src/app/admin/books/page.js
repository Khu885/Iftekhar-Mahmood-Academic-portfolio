"use client";

import AdminProtected from "@/components/admin/AdminProtected";
import AdminCrudPage from "@/components/admin/AdminCrudPage";
import { createBook, deleteBook, listBooks, reorderBooks, toggleBookPublished, updateBook } from "@/lib/admin-api";

const emptyForm = {
  title: "",
  subtitle: "",
  author: "",
  publisher: "",
  publicationYear: "",
  isbn: "",
  description: "",
  category: "",
  externalBookUrl: "",
  pdfExternalUrl: "",
  slug: "",
  displayOrder: "0",
  published: true,
  pdfAssetId: "",
  coverAssetId: "",
};

const fields = [
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "author", label: "Author" },
  { key: "publisher", label: "Publisher" },
  { key: "publicationYear", label: "Publication year", type: "number" },
  { key: "isbn", label: "ISBN" },
  { key: "description", label: "Description", type: "textarea", rows: 4 },
  { key: "category", label: "Category" },
  { key: "externalBookUrl", label: "External book URL" },
  { key: "pdfExternalUrl", label: "PDF URL" },
  { key: "slug", label: "Slug" },
  { key: "published", label: "Published", type: "checkbox" },
  { key: "pdfAssetId", label: "PDF asset", type: "file", accept: "application/pdf", uploadPrefix: "book-pdf" },
  { key: "coverAssetId", label: "Cover asset", type: "file", accept: "image/*", uploadPrefix: "book-cover" },
];

const toForm = (item) => ({
  ...emptyForm,
  ...item,
  publicationYear: item.publicationYear ?? "",
  displayOrder: item.displayOrder ?? 0,
  pdfAssetId: item.pdfAssetId || "",
  coverAssetId: item.coverAssetId || "",
});

const toPayload = (form) => ({
  title: form.title,
  subtitle: form.subtitle || null,
  author: form.author || null,
  publisher: form.publisher || null,
  publicationYear: form.publicationYear === "" ? null : Number(form.publicationYear),
  isbn: form.isbn || null,
  description: form.description || null,
  category: form.category || null,
  externalBookUrl: form.externalBookUrl || null,
  pdfExternalUrl: form.pdfExternalUrl || null,
  displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
  published: Boolean(form.published),
  slug: form.slug || null,
  pdfAssetId: form.pdfAssetId || null,
  coverAssetId: form.coverAssetId || null,
});

export default function BooksPage() {
  return (
    <AdminProtected>
      <AdminCrudPage
        title="Books"
        description="Create, edit, publish, and reorder books."
        itemLabel="book"
        loadItems={listBooks}
        saveItem={(id, payload) => (id ? updateBook(id, payload) : createBook(payload))}
        deleteItem={deleteBook}
        togglePublished={toggleBookPublished}
        reorderItems={reorderBooks}
        fields={fields}
        emptyForm={emptyForm}
        toForm={toForm}
        toPayload={toPayload}
      />
    </AdminProtected>
  );
}
