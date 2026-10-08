"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout, getUnreadMessageCount } from "@/lib/admin-api";

const LINKS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/publications",
    label: "Publications",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/admin/books",
    label: "Books",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: "/admin/cv",
    label: "CV",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/admin/messages",
    label: "Messages",
    badgeKey: "messages",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function AdminShell({ user, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchUnread = () => {
      getUnreadMessageCount()
        .then((count) => {
          if (active) setUnreadCount(count || 0);
        })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 25000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const userInitial = (user?.username || "A").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#eef0f4" }}>
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 flex w-[158px] flex-col"
        style={{ backgroundColor: "#1e2235" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            I
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-semibold leading-tight text-white">Iftekhar Mahmood</p>
            <p className="text-[9.5px] font-medium mt-0.5" style={{ color: "#64748b" }}>Admin Panel</p>
          </div>
        </div>

        <div className="mx-3 mb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Nav */}
        <nav className="flex-1 px-2">
          <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#3d4a5c" }}>
            Content
          </p>
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px] font-medium transition-all duration-200 ease-out"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.75))",
                        color: "#ffffff",
                        boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                      }
                    : { color: "#7a8499" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#b8c2d4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "#7a8499";
                  }
                }}
              >
                <span style={{ color: isActive ? "rgba(255,255,255,0.95)" : "#4a5568" }}>{link.icon}</span>
                <span className="flex-1 truncate">{link.label}</span>
                {link.badgeKey === "messages" && unreadCount > 0 && (
                  <span
                    className="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shadow-sm"
                    style={{ background: "linear-gradient(135deg, #ef4444, #f43f5e)" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-2 pb-2 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px] font-medium transition-all duration-150"
            style={{ color: "#7a8499" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#b8c2d4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.color = "#7a8499";
            }}
          >
            <svg className="h-[16px] w-[16px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px] font-medium transition-all duration-150 text-left"
            style={{ color: "#7a8499" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.07)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.color = "#7a8499";
            }}
          >
            <svg className="h-[16px] w-[16px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        </div>

        <div className="mx-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* User */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: "#374151" }}
            >
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11.5px] font-semibold text-white">{user?.username || "Admin"}</p>
              <p className="text-[9.5px]" style={{ color: "#64748b" }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-[158px]">
        <main className="min-h-screen p-8">
          <div key={pathname} className="admin-page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
