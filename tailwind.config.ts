import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        kraft: "#EAE3D2",
        "kraft-dark": "#DDD5C0",
        ink: "#1A1614",
        "ink-muted": "#6B6560",
        "ink-faint": "#A09A93",
        rust: "#8B4513",
        "rust-light": "#C4763A",
        pine: "#2D4A3E",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        paper: "2px 3px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        "paper-lg":
          "4px 6px 16px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.08)",
        "paper-hover":
          "6px 10px 24px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.10)",
        pin: "1px 2px 4px rgba(0,0,0,0.3)",
      },
      rotate: {
        "1": "1deg",
        "2": "2deg",
        "3": "3deg",
        "-1": "-1deg",
        "-2": "-2deg",
        "-3": "-3deg",
      },
      backgroundImage: {
        "kraft-texture":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
