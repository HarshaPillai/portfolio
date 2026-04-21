"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BsideLoader from "./BsideLoader";

const navLinks = [
  { href: "/",        label: "Projects" },
  { href: "/b-side",  label: "B-Side"   },
  { href: "/writing", label: "Writing"  },
  { href: "/resume",  label: "Resume"   },
  { href: "/about",   label: "About"    },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [exitTarget, setExitTarget] = useState<string | null>(null);

  const isDark = pathname.startsWith("/b-side");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (isDark && !isActive(href)) {
        e.preventDefault();
        setExitTarget(href);
      }
    },
    [isDark, pathname] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleExitComplete = useCallback(() => {
    const target = exitTarget;
    setExitTarget(null);
    if (target) router.push(target);
  }, [exitTarget, router]);

  return (
    <>
      {/* Exit animation — portalled via BsideLoader */}
      {exitTarget && (
        <BsideLoader direction="exit" onComplete={handleExitComplete} />
      )}

      <aside
        className="app-sidebar"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          width: "var(--sidebar-width)",
          zIndex: 50,
          backgroundColor: isDark ? "transparent" : "#FFFFFF",
          borderRight: isDark ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background-color 0.3s, border-color 0.3s",
        }}
      >
        {/* Wordmark */}
        <div style={{ position: "absolute", top: 32, left: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--font-radio-grotesk), Impact, sans-serif",
                fontSize: "28px",
                fontWeight: 700,
                color: isDark ? "#FF5500" : "#F35900",
                letterSpacing: 0,
                lineHeight: 1,
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              Harsha Pillai
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav
          style={{
            position: "absolute",
            bottom: 180,
            left: 32,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "30px",
                  fontWeight: 500,
                  letterSpacing: "-0.05em",
                  color: active
                    ? (isDark ? "rgba(255,255,255,0.85)" : "#3A3A3A")
                    : (isDark ? "rgba(255,255,255,0.2)"  : "#B5B5B5"),
                  lineHeight: 1.3,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
