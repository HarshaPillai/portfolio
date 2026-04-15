"use client";

export default function AboutPage() {
  const label: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: "14px",
    letterSpacing: "-0.09em",
    color: "rgba(58,58,58,0.5)",
    textTransform: "uppercase" as const,
    marginBottom: "12px",
  };

  const body: React.CSSProperties = {
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "-0.05em",
    color: "#3A3A3A",
    lineHeight: 1.7,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: "64px 48px",
        maxWidth: "640px",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Label */}
        <p style={label}>About</p>

        {/* Bio */}
        <div style={{ marginBottom: "48px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={body}>
            I&apos;ve always been drawn to puzzles. The kind where there&apos;s
            no obvious right answer — just a mess of constraints, people, and
            competing needs.
          </p>
          <p style={body}>
            Somewhere along the way those puzzles stopped being hypothetical and
            became real products, real users, real businesses. Turns out I like
            them even more with stakes.
          </p>
          <p style={body}>
            I design SaaS products end-to-end — from blank canvas to shipped
            code. I build with AI to compress the distance between an idea and
            something you can interact with.
          </p>
        </div>

        {/* Currently / Looking for */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            paddingTop: "32px",
            marginBottom: "48px",
            borderTop: "1px solid #E5E5E5",
          }}
        >
          <div>
            <p style={label}>Currently</p>
            <p style={{ ...body, fontSize: "15px" }}>
              Placeholder — add your current role or focus here.
            </p>
          </div>
          <div>
            <p style={label}>Looking for</p>
            <p style={{ ...body, fontSize: "15px" }}>
              Founding design roles at early-stage SaaS.
              <br />
              Available July 2025.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { label: "Email", href: "mailto:harsha@harshapillai.com" },
            { label: "LinkedIn", href: "https://linkedin.com/in/harshapillai" },
            { label: "Read.cv", href: "https://read.cv/harshapillai" },
          ].map(({ label: l, href }) => (
            <a
              key={l}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "13px",
                letterSpacing: "-0.09em",
                color: "#3A3A3A",
                textDecoration: "none",
                borderBottom: "1px solid #E5E5E5",
                paddingBottom: "2px",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#F35900";
                (e.target as HTMLElement).style.borderColor = "#F35900";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#3A3A3A";
                (e.target as HTMLElement).style.borderColor = "#E5E5E5";
              }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
