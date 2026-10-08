"use client";

import { usePathname } from "next/navigation";
import AdminProtected from "@/components/admin/AdminProtected";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Do not wrap login page with AdminProtected / AdminShell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminProtected>{children}</AdminProtected>;
}
