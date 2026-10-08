"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMe } from "@/lib/admin-api";

export default function Header({ activeTab, onSelectTab }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user) setIsAuthenticated(true);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "publications", label: "Publications" },
    { id: "projects", label: "Projects" },
    { id: "books", label: "Books" },
    { id: "cv", label: "CV" },
    { id: "contact", label: "Contact" },
  ];

  const handleTabClick = (id) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 border-b border-white/10 ${isScrolled ? "bg-slate-950/90 shadow-lg" : "bg-slate-950/40 backdrop-blur-md"
        }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Site Title / Author Name (Left) */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <button
            onClick={() => handleTabClick("home")}
            className="group flex shrink-0 items-center space-x-2.5 text-white hover:text-blue-200 transition-colors text-left"
          >
            <span className="text-xl sm:text-[22px] font-bold tracking-tight text-white drop-shadow-sm">
              Iftekhar Mahmood
            </span>
            <span className="text-[11px] font-semibold text-blue-300 bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 rounded-full tracking-wide uppercase shadow-sm">
              Ph.D.
            </span>
          </button>
        </div>

        {/* Desktop Navigation Menu (Center) */}
        <div className="flex-none flex items-center justify-center">
          <nav
            id="desktop-nav"
            className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/20 transition-transform duration-300 ease-out"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`nav-link ${activeTab === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Top Right Corner Login Button (Far Right) */}
        <div className="flex-1 flex items-center justify-end gap-3 shrink-0">
          <Link
            href="/admin/login"
            id="admin-login-button"
            className="inline-flex items-center gap-2 rounded-none bg-yellow-500 px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-yellow-600 shadow-sm"
            title={isAuthenticated ? "Open Admin Dashboard" : "Sign in to Admin"}
          >
            {isAuthenticated ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                <span>Admin Panel</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Login</span>
              </>
            )}
          </Link>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-slate-200 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-6 py-4 space-y-1.5 shadow-2xl"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${activeTab === item.id
                ? "font-semibold text-white bg-white/15"
                : "font-medium text-slate-300 hover:text-white hover:bg-white/10"
                }`}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-2 border-t border-white/10 pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-none bg-yellow-500 px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-yellow-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>{isAuthenticated ? "Admin Panel" : "Login"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
