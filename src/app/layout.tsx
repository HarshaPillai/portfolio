import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harsha Pillai",
  description:
    "I design SaaS products that feel inevitable. I build with AI to get there faster.",
  openGraph: {
    title: "Harsha Pillai",
    description:
      "I design SaaS products that feel inevitable. I build with AI to get there faster.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <Nav />
        <div style={{ paddingTop: "var(--nav-height)" }}>{children}</div>
      </body>
    </html>
  );
}
