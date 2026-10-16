const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function buildUrl(path) {
  if (!API_BASE_URL) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCookie(name) {
  if (typeof document === "undefined") {
    return "";
  }
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1] || "";
}

async function primeCsrf() {
  await fetch(buildUrl("/api/public/books"), { credentials: "include" });
}

async function request(path, options = {}) {
  const method = options.method || "GET";
  const headers = { Accept: "application/json", ...(options.headers || {}) };
  const isUnsafe = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());

  if (isUnsafe) {
    if (!getCookie("XSRF-TOKEN")) {
      await primeCsrf();
    }
    const token = getCookie("XSRF-TOKEN");
    if (token) {
      headers["X-XSRF-TOKEN"] = token;
    }
  }

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body,
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }
  return payload?.data;
}

let cachedSessionUser = null;

export function getCachedUser() {
  return cachedSessionUser;
}

export function setCachedUser(user) {
  cachedSessionUser = user;
}

export function resetCachedUser() {
  cachedSessionUser = null;
}

export async function login(username, password) {
  cachedSessionUser = null;
  return request("/api/auth/login", { method: "POST", body: { username, password } });
}

export async function logout() {
  cachedSessionUser = null;
  return request("/api/auth/logout", { method: "POST" });
}

export async function getMe() {
  const user = await request("/api/auth/me");
  cachedSessionUser = user;
  return user;
}

export async function uploadFile(file, prefix) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prefix", prefix);
  return request("/api/admin/files/upload", { method: "POST", body: formData });
}

export async function listBooks() { return request("/api/admin/books"); }
export async function createBook(body) { return request("/api/admin/books", { method: "POST", body }); }
export async function updateBook(id, body) { return request(`/api/admin/books/${id}`, { method: "PUT", body }); }
export async function deleteBook(id) { return request(`/api/admin/books/${id}`, { method: "DELETE" }); }
export async function toggleBookPublished(id, published) { return request(`/api/admin/books/${id}/published`, { method: "PATCH", body: { published } }); }
export async function reorderBooks(ids) { return request("/api/admin/books/reorder", { method: "PATCH", body: ids }); }

export async function listPublications() { return request("/api/admin/publications"); }
export async function createPublication(body) { return request("/api/admin/publications", { method: "POST", body }); }
export async function updatePublication(id, body) { return request(`/api/admin/publications/${id}`, { method: "PUT", body }); }
export async function deletePublication(id) { return request(`/api/admin/publications/${id}`, { method: "DELETE" }); }
export async function togglePublicationPublished(id, published) { return request(`/api/admin/publications/${id}/published`, { method: "PATCH", body: { published } }); }
export async function reorderPublications(ids) { return request("/api/admin/publications/reorder", { method: "PATCH", body: ids }); }

export async function listProjects() { return request("/api/admin/projects"); }
export async function createProject(body) { return request("/api/admin/projects", { method: "POST", body }); }
export async function updateProject(id, body) { return request(`/api/admin/projects/${id}`, { method: "PUT", body }); }
export async function deleteProject(id) { return request(`/api/admin/projects/${id}`, { method: "DELETE" }); }
export async function toggleProjectPublished(id, published) { return request(`/api/admin/projects/${id}/published`, { method: "PATCH", body: { published } }); }
export async function reorderProjects(ids) { return request("/api/admin/projects/reorder", { method: "PATCH", body: ids }); }

export async function getCv() { return request("/api/admin/cv"); }
export async function upsertCv(body) { return request("/api/admin/cv", { method: "PUT", body }); }
export async function deleteCvDocument() { return request("/api/admin/cv/document", { method: "DELETE" }); }
export async function activateCvDocument(documentId) { return request("/api/admin/cv/activate", { method: "PATCH", body: { documentId } }); }

export async function listMessages() { return request("/api/admin/messages"); }
export async function getUnreadMessageCount() { return request("/api/admin/messages/unread-count"); }
export async function markMessageRead(id, read) { return request(`/api/admin/messages/${id}/read`, { method: "PATCH", body: { read } }); }
export async function deleteMessage(id) { return request(`/api/admin/messages/${id}`, { method: "DELETE" }); }
