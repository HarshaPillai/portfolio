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
        background: "#FFFFFF",
        foreground: "#3A3A3A",
        orange: "#F35900",
        muted: "#B5B5B5",
        divider: "#E5E5E5",
      },
      fontFamily: {
        wordmark: ["var(--font-radio-grotesk)", "Impact", "sans-serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      maxWidth: {
        site: "1200px",
      },
      letterSpacing: {
        tight5: "-0.05em",
        tight9: "-0.09em",
      },
    },
  },
  plugins: [],
};

export default config;
