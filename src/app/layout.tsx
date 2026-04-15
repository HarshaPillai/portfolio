import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Harsha Pillai",
  description:
    "I design SaaS products that feel inevitable. I build with AI to get there faster.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Plus Jakarta Sans + DM Mono — loaded at browser runtime */}
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
        <div style={{ marginLeft: "var(--sidebar-width)" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
