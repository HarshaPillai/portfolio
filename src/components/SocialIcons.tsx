"use client";

import { useState, useCallback } from "react";

function MediumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6.5" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="14.5" cy="10" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="19" y1="4.5" x2="19" y2="15.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41v-1.437c-2.362.513-2.861-1.138-2.861-1.138-.386-.98-.943-1.241-.943-1.241-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.989.924 2.474.707.077-.549.297-.924.54-1.136-1.886-.214-3.868-.943-3.868-4.196 0-.927.331-1.684.875-2.277-.088-.215-.379-1.078.083-2.246 0 0 .713-.228 2.335.87a8.12 8.12 0 012.124-.286c.72.004 1.445.097 2.124.286 1.622-1.098 2.334-.87 2.334-.87.463 1.168.172 2.031.084 2.246.545.593.874 1.35.874 2.277 0 3.261-1.985 3.98-3.876 4.19.305.263.576.78.576 1.572v2.328c0 .228.153.492.584.409A8.502 8.502 0 0010 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="1.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="5" y="8.5" width="2.2" height="6" fill="currentColor" />
      <circle cx="6.1" cy="6.2" r="1.2" fill="currentColor" />
      <path d="M9.5 8.5h2.1v.9c.4-.65 1.1-1.1 2-.1 1.4 0 1.9 1 1.9 2.4V14.5H13.3v-2.4c0-.7-.2-1.3-.9-1.3-.7 0-1.1.5-1.1 1.3v2.4H9.5V8.5z" fill="currentColor" />
    </svg>
  );
}

export function EnvelopeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

const EMAIL = "harsha.pillai98@gmail.com";

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ color: "#B5B5B5", transition: "color 0.15s ease", display: "flex", alignItems: "center" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#F35900")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#B5B5B5")}
    >
      {children}
    </a>
  );
}

export default function SocialIcons() {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div
      className="social-icons-fixed"
      style={{
        position: "fixed",
        top: 32,
        right: 32,
        zIndex: 100,
        display: "flex",
        gap: 20,
        alignItems: "center",
      }}
    >
      <SocialLink href="https://medium.com/@harshapillai" label="Medium">
        <MediumIcon />
      </SocialLink>
      <SocialLink href="https://github.com/HarshaPillai" label="GitHub">
        <GitHubIcon />
      </SocialLink>
      <SocialLink href="https://www.linkedin.com/in/harsha-pillai/" label="LinkedIn">
        <LinkedInIcon />
      </SocialLink>

      {/* Email copy button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCopy}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Copy email address"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: hovered ? "#F35900" : "#B5B5B5",
            transition: "color 0.15s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <EnvelopeIcon />
        </button>
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              right: 0,
              background: "#1a1a1a",
              color: "#ffffff",
              fontSize: 10,
              padding: "4px 8px",
              borderRadius: 4,
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {copied ? "Looking forward to chatting!" : "Copy my email"}
          </div>
        )}
      </div>
    </div>
  );
}
