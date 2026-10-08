"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminProtected from "@/components/admin/AdminProtected";
import { listBooks, listPublications, listProjects, getCv, listMessages } from "@/lib/admin-api";

const STAT_CONFIG = [
  {
    key: "publications",
    label: "PUBLICATIONS",
    href: "/admin/publications",
    cardBg: "linear-gradient(145deg, #ede9fe 0%, #c4b5fd 45%, #a78bfa 100%)",
    iconBg: "linear-gradient(135deg, #7c3aed, #9333ea)",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    key: "projects",
    label: "PROJECTS",
    href: "/admin/projects",
    cardBg: "linear-gradient(145deg, #d1fae5 0%, #6ee7b7 45%, #34d399 100%)",
    iconBg: "linear-gradient(135deg, #059669, #10b981)",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    key: "books",
    label: "BOOKS",
    href: "/admin/books",
    cardBg: "linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 45%, #a5b4fc 100%)",
    iconBg: "linear-gradient(135deg, #6366f1, #818cf8)",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: "cv",
    label: "CV DOCUMENTS",
    href: "/admin/cv",
    cardBg: "linear-gradient(145deg, #ffedd5 0%, #fed7aa 45%, #fb923c 100%)",
    iconBg: "linear-gradient(135deg, #ea580c, #f97316)",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    key: "messages",
    label: "MESSAGES",
    href: "/admin/messages",
    cardBg: "linear-gradient(145deg, #fce7f3 0%, #fbcfe8 45%, #f472b6 100%)",
    iconBg: "linear-gradient(135deg, #db2777, #ec4899)",
    icon: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const STAT_MAP = STAT_CONFIG.reduce((acc, cur) => {
  acc[cur.key] = cur;
  return acc;
}, {});

function StatCard({ config, value, badge }) {
  if (!config) return null;
  return (
    <Link href={config.href} className="group block h-full">
      <div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
        style={{ background: config.cardBg }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(0,0,0,0.5)" }}>
                {config.label}
              </p>
              {badge && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-4xl font-extrabold tracking-tight" style={{ color: "#111827" }}>
              {value ?? 0}
            </p>
          </div>
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-md"
            style={{ background: config.iconBg }}
          >
            {config.icon}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(0,0,0,0.5)" }}>
          <span>Manage</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function DashboardBody() {
  const [stats, setStats] = useState({ messages: 0, unreadMessages: 0, books: 0, publications: 0, projects: 0, cv: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      listBooks().catch(() => []),
      listPublications().catch(() => []),
      listProjects().catch(() => []),
      getCv().catch(() => null),
      listMessages().catch(() => []),
    ]).then(([books, publications, projects, cv, messages]) => {
      if (active) {
        const msgs = Array.isArray(messages) ? messages : [];
        const unread = msgs.filter((m) => !m.read).length;
        setStats({
          messages: msgs.length,
          unreadMessages: unread,
          books: (books || []).length,
          publications: (publications || []).length,
          projects: (projects || []).length,
          cv: cv ? 1 : 0,
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl bg-white px-7 py-6 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
        <div>
          <span
            className="inline-block rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ backgroundColor: "#f0f4ff", color: "#6366f1" }}
          >
            Overview
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
            Manage portfolio content and inbox inquiries from one place.
          </p>
        </div>
      </div>

      {/* Stat Cards Grid matching the mockup */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Row 1, Col 1: Publications */}
        <div className="lg:col-start-1 lg:row-start-1">
          <StatCard config={STAT_MAP.publications} value={stats.publications} />
        </div>

        {/* Row 1, Col 2: Projects */}
        <div className="lg:col-start-2 lg:row-start-1">
          <StatCard config={STAT_MAP.projects} value={stats.projects} />
        </div>

        {/* Row 2, Col 1: Books */}
        <div className="lg:col-start-1 lg:row-start-2">
          <StatCard config={STAT_MAP.books} value={stats.books} />
        </div>

        {/* Row 2, Col 2: CV Documents */}
        <div className="lg:col-start-2 lg:row-start-2">
          <StatCard config={STAT_MAP.cv} value={stats.cv} />
        </div>

        {/* Col 3: Messages vertically centered */}
        <div className="sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:self-center">
          <StatCard
            config={STAT_MAP.messages}
            value={stats.messages}
            badge={stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : null}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProtected>
      <DashboardBody />
    </AdminProtected>
  );
}
