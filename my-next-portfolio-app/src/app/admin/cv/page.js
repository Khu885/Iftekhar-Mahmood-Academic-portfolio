"use client";

import AdminProtected from "@/components/admin/AdminProtected";
import AdminCrudPage from "@/components/admin/AdminCrudPage";
import { deleteCvDocument, getCv, upsertCv, activateCvDocument } from "@/lib/admin-api";

const emptyForm = {
  title: "",
  description: "",
  externalUrl: "",
  assetId: "",
  active: true,
  sections: "[]",
};

const fields = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", type: "textarea", rows: 3 },
  { key: "externalUrl", label: "External URL" },
  { key: "assetId", label: "CV PDF asset", type: "file", accept: "application/pdf", uploadPrefix: "cv-pdf" },
  { key: "active", label: "Active", type: "checkbox" },
  { key: "sections", label: "Sections JSON", type: "json", rows: 10 },
];

const toForm = (cv) => ({
  ...emptyForm,
  ...cv,
  assetId: cv.assetId || "",
  sections: JSON.stringify(
    (cv.sections || []).map((section) => ({
      sectionType: section.sectionType,
      title: section.title,
      displayOrder: section.displayOrder,
      visible: section.visible,
      entries: (section.entries || []).map((entry) => ({
        heading: entry.heading,
        organization: entry.organization,
        location: entry.location,
        startDate: entry.startDate,
        endDate: entry.endDate,
        description: entry.description,
        displayOrder: entry.displayOrder,
      })),
    })),
    null,
    2
  ),
});

const toPayload = (form) => {
  let sections = [];
  try {
    sections = JSON.parse(form.sections || "[]");
  } catch {
    sections = [];
  }

  return {
    title: form.title,
    description: form.description || null,
    externalUrl: form.externalUrl || null,
    assetId: form.assetId || null,
    active: Boolean(form.active),
    sections,
  };
};

const loadItems = async () => {
  const cv = await getCv();
  return cv ? [{ ...cv, published: cv.active }] : [];
};

export default function CvPage() {
  return (
    <AdminProtected>
      <AdminCrudPage
        title="CV"
        description="Manage the active CV document and structured sections."
        itemLabel="CV document"
        toggleOnLabel="Deactivate"
        toggleOffLabel="Activate"
        loadItems={loadItems}
        saveItem={(_, payload) => upsertCv(payload)}
        deleteItem={() => deleteCvDocument()}
        togglePublished={async (id, published) => activateCvDocument(id)}
        reorderItems={async () => {}}
        fields={fields}
        emptyForm={emptyForm}
        toForm={toForm}
        toPayload={toPayload}
      />
    </AdminProtected>
  );
}
