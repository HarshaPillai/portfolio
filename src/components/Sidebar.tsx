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
      className="fixed left-0 top-0 h-full bg-white z-50 flex flex-col"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Wordmark */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/">
          <span
            className="block leading-none"
            style={{
              fontFamily: "var(--font-radio-grotesk), Impact, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "#F35900",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            Harsha
            <br />
            Pillai
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col px-6 gap-1 mt-2">
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
