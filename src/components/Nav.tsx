"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "mailto:harsha@harshapillai.com", label: "Contact", external: true },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12"
      style={{
        height: "var(--nav-height)",
        backgroundColor: "#F5F4F0",
        borderBottom: "1px solid rgba(10,10,10,0.07)",
      }}
    >
      {/* Name */}
      <Link
        href="/"
        className="font-sans text-sm font-medium tracking-tight text-foreground hover:text-accent transition-colors duration-200"
      >
        Harsha Pillai
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-8">
        {navLinks.map(({ href, label, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              className="font-mono text-xs tracking-wider text-muted hover:text-accent transition-colors duration-200"
            >
              {label}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs tracking-wider transition-colors duration-200 ${
                pathname === href
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
