import React from "react";

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 12,
  color: "#F35900",
  textDecoration: "none",
  letterSpacing: "-0.02em",
  display: "inline-flex" as const,
  alignItems: "center",
  gap: 6,
  borderBottom: "1px solid #F35900",
  paddingBottom: 2,
};

export default function ResumePage() {
  return (
    <div style={{ padding: "48px 48px 80px", maxWidth: 800 }}>
      
        href="/documents/HarshaPillai_Resume.pdf"
        download="HarshaPillai_Resume.pdf"
        style={linkStyle}
      >
        Download PDF →
      </a>
    </div>
  );
}