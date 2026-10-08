"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "./AdminShell";
import { getCachedUser, getMe } from "@/lib/admin-api";

const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export default function AdminProtected({ children }) {
  const router = useRouter();
  const existingContext = useContext(AdminContext);

  // If already inside an AdminProtected wrapper (e.g. from admin/layout.js), pass children through directly
  if (existingContext) {
    return <>{children}</>;
  }

  return <AdminProtectedSession router={router}>{children}</AdminProtectedSession>;
}

function AdminProtectedSession({ children, router }) {
  const [user, setUser] = useState(getCachedUser());
  const [loading, setLoading] = useState(!getCachedUser());

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await getMe();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        router.push("/admin/login");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#eef0f4" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-300" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-500">Loading admin session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ user, setUser }}>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminContext.Provider>
  );
}
