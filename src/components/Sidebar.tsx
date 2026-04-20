"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Projects" },
  { href: "/lab", label: "Labs" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      className="app-sidebar"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: "var(--sidebar-width)",
        zIndex: 50,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Wordmark — floats top-left, lots of open space below */}
      <div style={{ position: "absolute", top: 32, left: 32 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "var(--font-radio-grotesk), Impact, sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#F35900",
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

      {/* Nav — floats lower-left, not directly below wordmark */}
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
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "30px",
                fontWeight: 500,
                letterSpacing: "-0.05em",
                color: active ? "#3A3A3A" : "#B5B5B5",
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
  );
}
