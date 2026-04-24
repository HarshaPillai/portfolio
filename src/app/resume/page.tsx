export default function ResumePage() {
  return (
    <div style={{ padding: "48px 48px 80px", maxWidth: 800 }}>
      <a
        href="/documents/HarshaPillai_Resume.pdf"
        download="HarshaPillai_Resume.pdf"
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 12,
          color: "#F35900",
          textDecoration: "none",
          letterSpacing: "-0.02em",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderBottom: "1px solid #F35900",
          paddingBottom: 2,
        }}
      >
        Download PDF →
      </a>
    </div>
  );
}