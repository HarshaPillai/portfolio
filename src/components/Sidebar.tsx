"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Work", exact: true },
  { href: "/work", label: "All Work", exact: false },
  { href: "/lab", label: "Lab" , exact: false},
  { href: "/about", label: "About", exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar-texture fixed left-0 top-0 h-full w-[220px] z-40 hidden md:flex flex-col border-r border-kraft-dark/60">
        {/* Top: name + title */}
        <div className="px-6 pt-8 pb-6">
          <Link href="/" className="group block">
            <span className="block font-serif text-[22px] font-bold leading-tight tracking-tight text-ink group-hover:text-rust transition-colors duration-200">
              Harsha
              <br />
              Pillai
            </span>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mt-2 leading-snug">
            Product designer
            <br />
            who ships code.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-kraft-dark/80" />

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-4 pt-6">
          {navLinks.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link flex items-center gap-2 px-2 py-1.5 rounded transition-all duration-150
                ${isActive(href, exact)
                  ? "text-ink bg-cream/60"
                  : "hover:text-ink hover:bg-cream/40"
                }`}
            >
              {isActive(href, exact) && (
                <span className="w-1 h-1 rounded-full bg-rust inline-block" />
              )}
              {!isActive(href, exact) && (
                <span className="w-1 h-1 rounded-full bg-transparent inline-block" />
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom status */}
        <div className="px-6 pb-7">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pine animate-pulse" />
            <span className="font-mono text-[10px] text-pine uppercase tracking-wider">
              Available
            </span>
          </div>
          <p className="font-mono text-[10px] text-ink-faint leading-relaxed">
            Open to new work
            <br />
            July 2025
          </p>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 sidebar-texture border-b border-kraft-dark/60 flex items-center justify-between px-4">
        <Link href="/" className="font-serif text-[18px] font-bold text-ink tracking-tight">
          Harsha Pillai
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-30 sidebar-texture border-b border-kraft-dark/60 px-4 py-3 flex flex-col gap-2">
          {navLinks.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`nav-link py-1.5 ${isActive(href, exact) ? "text-ink" : ""}`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-kraft-dark/60 mt-1">
            <span className="font-mono text-[10px] text-pine uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pine" />
              Available · July 2025
            </span>
          </div>
        </div>
      )}
    </>
  );
}
