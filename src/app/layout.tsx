import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SocialIcons from "@/components/SocialIcons";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Harsha Pillai",
  description: "Product Designer & Design Strategist based in Chicago, Illinois.",
  icons: {
    icon: '/images/flavicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

        <SocialIcons />

        <div className="app-content" style={{ marginLeft: "var(--sidebar-width)" }}>
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
