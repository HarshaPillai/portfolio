"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BsideLoader from "./BsideLoader";
import { EnvelopeIcon } from "./SocialIcons";

const navLinks = [
  { href: "/",        label: "Projects" },
  { href: "/b-side",  label: "B-Side"   },
  { href: "/writing", label: "Writing"  },
  { href: "/resume",  label: "Résumé"   },
  { href: "/about",   label: "About"    },
];

const EMAIL = "harsha.pillai98@gmail.com";

function MobileOverlay({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        animation: "overlayFadeIn 0.2s ease",
      }}
    >
      {/* Top bar inside overlay */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-radio-grotesk), Impact, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#F35900",
          }}
        >
          Harsha Pillai
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 24,
            color: "#3A3A3A",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Nav links — centered */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.05em",
              color: isActive(href) ? "#F35900" : "#3A3A3A",
              textDecoration: "none",
              lineHeight: 1.3,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Social icons row at bottom */}
      <div
        style={{
          padding: "24px 24px 40px",
          display: "flex",
          gap: 28,
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {[
          { href: "https://medium.com/@harshapillai", label: "Medium", icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="6.5" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <ellipse cx="14.5" cy="10" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.3" />
              <line x1="19" y1="4.5" x2="19" y2="15.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          )},
          { href: "https://github.com/HarshaPillai", label: "GitHub", icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41v-1.437c-2.362.513-2.861-1.138-2.861-1.138-.386-.98-.943-1.241-.943-1.241-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.989.924 2.474.707.077-.549.297-.924.54-1.136-1.886-.214-3.868-.943-3.868-4.196 0-.927.331-1.684.875-2.277-.088-.215-.379-1.078.083-2.246 0 0 .713-.228 2.335.87a8.12 8.12 0 012.124-.286c.72.004 1.445.097 2.124.286 1.622-1.098 2.334-.87 2.334-.87.463 1.168.172 2.031.084 2.246.545.593.874 1.35.874 2.277 0 3.261-1.985 3.98-3.876 4.19.305.263.576.78.576 1.572v2.328c0 .228.153.492.584.409A8.502 8.502 0 0010 1.5z" fill="currentColor" />
            </svg>
          )},
          { href: "https://www.linkedin.com/in/harsha-pillai/", label: "LinkedIn", icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1.5" y="1.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="5" y="8.5" width="2.2" height="6" fill="currentColor" />
              <circle cx="6.1" cy="6.2" r="1.2" fill="currentColor" />
              <path d="M9.5 8.5h2.1v.9c.4-.65 1.1-1.1 2-.1 1.4 0 1.9 1 1.9 2.4V14.5H13.3v-2.4c0-.7-.2-1.3-.9-1.3-.7 0-1.1.5-1.1 1.3v2.4H9.5V8.5z" fill="currentColor" />
            </svg>
          )},
        ].map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{ color: "#3A3A3A", transition: "color 0.15s ease", display: "flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F35900")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#3A3A3A")}
          >
            {icon}
          </a>
        ))}
        <button
          onClick={copyEmail}
          aria-label="Copy email"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: emailCopied ? "#F35900" : "#3A3A3A",
            transition: "color 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11,
          }}
        >
          <EnvelopeIcon size={18} />
          {emailCopied && <span style={{ color: "#F35900" }}>Copied!</span>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [exitTarget,   setExitTarget]   = useState<string | null>(null);
  const [menuOpen,     setMenuOpen]     = useState(false);

  if (pathname.startsWith("/projects/") && pathname !== "/projects") {
    return null;
  }

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

      {/* ── Desktop sidebar ── */}
      <aside
        className="app-sidebar"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          width: "var(--sidebar-width)",
          zIndex: 50,
          backgroundColor: "transparent",
          borderRight: "none",
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

      {/* ── Mobile top navbar ── */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          zIndex: 150,
          backgroundColor: isDark ? "transparent" : "#FFFFFF",
          borderBottom: isDark ? "none" : "1px solid rgba(0,0,0,0.08)",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
        className="mobile-navbar"
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "var(--font-radio-grotesk), Impact, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#F35900",
              lineHeight: 1,
            }}
          >
            Harsha Pillai
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 1.5,
                backgroundColor: "#3A3A3A",
                borderRadius: 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      <MobileOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
