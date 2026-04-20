import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Harsha Pillai",
  description:
    "I design SaaS products that feel inevitable. I build with AI to get there faster.",
};

function MediumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6.5" cy="10" r="5.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <ellipse cx="14.5" cy="10" rx="2.5" ry="5.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <line x1="19" y1="4.5" x2="19" y2="15.5" stroke="#B5B5B5" strokeWidth="1.3" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="1.5" width="17" height="17" rx="2.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <rect x="5" y="8.5" width="2.2" height="6" fill="#B5B5B5" />
      <circle cx="6.1" cy="6.2" r="1.2" fill="#B5B5B5" />
      <path d="M9.5 8.5h2.1v.9c.4-.65 1.1-1.1 2-.1 1.4 0 1.9 1 1.9 2.4V14.5H13.3v-2.4c0-.7-.2-1.3-.9-1.3-.7 0-1.1.5-1.1 1.3v2.4H9.5V8.5z" fill="#B5B5B5" />
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
        fill="#B5B5B5"
      />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500&family=DM+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-radio-grotesk: "PP Radio Grotesk";
            --font-jakarta: "Plus Jakarta Sans";
            --font-dm-mono: "DM Mono";
          }
        `}</style>
      </head>
      <body className="bg-background text-foreground">
        <Sidebar />

        {/* Social icons — fixed top-right, always visible */}
        <div
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
          <a
            href="https://medium.com/@harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Medium"
          >
            <MediumIcon />
          </a>
          <a
            href="https://linkedin.com/in/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://github.com/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>

        <div className="app-content" style={{ marginLeft: "var(--sidebar-width)" }}>{children}</div>
      </body>
    </html>
  );
}
