"use client";

import AdminProtected from "@/components/admin/AdminProtected";
import AdminCrudPage from "@/components/admin/AdminCrudPage";
import { createProject, deleteProject, listProjects, reorderProjects, toggleProjectPublished, updateProject } from "@/lib/admin-api";

const emptyForm = {
  title: "",
  category: "",
  status: "",
  description: "",
  slug: "",
  displayOrder: "0",
  published: true,
  highlights: [],
};

const fields = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "description", label: "Description", type: "textarea", rows: 4 },
  { key: "slug", label: "Slug" },
  { key: "published", label: "Published", type: "checkbox" },
  {
    key: "highlights",
    label: "Key Contributions",
    type: "list",
    placeholder: "e.g. Demonstrated 0.5–1.5-fold clinical prediction accuracy...",
  },
];

const toForm = (item) => ({
  ...emptyForm,
  ...item,
  displayOrder: item.displayOrder ?? 0,
  highlights: (item.highlights || [])
    .map((highlight) => (typeof highlight === "string" ? highlight : highlight.highlightText || ""))
    .filter(Boolean),
});

const toPayload = (form) => {
  let list = [];
  if (Array.isArray(form.highlights)) {
    list = form.highlights;
  } else if (typeof form.highlights === "string") {
    try {
      const parsed = JSON.parse(form.highlights);
      list = Array.isArray(parsed) ? parsed : [form.highlights];
    } catch {
      list = form.highlights.split("\n");
    }
  }

  const highlights = list
    .map((item) => (typeof item === "string" ? item.trim() : item?.highlightText?.trim() || ""))
    .filter(Boolean)
    .map((highlightText, index) => ({
      highlightText,
      displayOrder: index,
    }));

  return {
    title: form.title,
    category: form.category || null,
    status: form.status || null,
    description: form.description || null,
    slug: form.slug || null,
    displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
    published: Boolean(form.published),
    highlights,
  };
};

export default function ProjectsPage() {
  return (
    <AdminProtected>
      <AdminCrudPage
        title="Projects"
        description="Manage project cards and highlight lists."
        itemLabel="project"
        loadItems={listProjects}
        saveItem={(id, payload) => (id ? updateProject(id, payload) : createProject(payload))}
        deleteItem={deleteProject}
        togglePublished={toggleProjectPublished}
        reorderItems={reorderProjects}
        fields={fields}
        emptyForm={emptyForm}
        toForm={toForm}
        toPayload={toPayload}
      />
    </AdminProtected>
  );
}
