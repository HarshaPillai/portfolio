"use client";

import React from "react";
import DesignPhilosophy from "@/components/DesignPhilosophy";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function O(props: any) {
  return <span style={{ color: "#F35900", fontWeight: 600 }}>{props.children}</span>;
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: "-0.03em",
  color: "#3A3A3A",
  lineHeight: 1.8,
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.02em",
  color: "rgba(58,58,58,0.45)",
  textTransform: "uppercase",
  lineHeight: 1.4,
};

export default function AboutPage() {
  return (
    <div className="about-layout" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left column */}
      <div
        className="about-bio"
        style={{
          flex: "0 0 60%",
          height: "100vh",
          overflowY: "auto",
          padding: "60px 36px 60px 60px",
          boxSizing: "border-box",
        }}
      >
        {/* Opening line */}
        <p
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 20,
            fontWeight: 500,
            fontStyle: "italic",
            letterSpacing: "-0.03em",
            color: "#3A3A3A",
            lineHeight: 1.5,
            margin: "0 0 28px 0",
          }}
        >
          Before she was a product designer, Harsha was an{" "}
          <O>architectural designer</O>, an <O>engineer</O>, a{" "}
          <O>competitive dancer</O>, and a kid obsessed with puzzles.
        </p>

        {/* Bio paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={bodyStyle}>
            Born in Switzerland, raised in Germany, and of Indian heritage, she
            naturally moves between cultures, languages, and ways of seeing the
            world. This ever-changing perspective shaped her approach, deeply
            considering the systems we live in, and most importantly, designing
            with care for those at the heart of it all.
          </p>
          <p style={bodyStyle}>
            With 3+ years in product, she still loves everything about it — the{" "}
            <O>strategy</O>, the <O>craft</O>, the moment something gets into
            someone&apos;s hands and actually works. She wants to be close to the
            thing being built and close to the people it is being built for.
          </p>
          <p style={bodyStyle}>
            What she cares about most is what gets built in the first place, and
            why. In a world where anything can be made, it is not a question of
            can we but rather <O>should we</O>. Her professor and mentor Allan
            Chochinov always reminded her that designers are in the{" "}
            <O>consequence business</O>, and she tries not to forget that.
          </p>
          <p style={bodyStyle}>
            Outside of design, you&apos;ll find her throwing punches in kickboxing
            class, rooting for the NY Knicks, or keeping her NYT Connections
            streak alive.
          </p>
          <p style={bodyStyle}>
            Ultimately, trying to live as many lives as possible in this one.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(0,0,0,0.08)",
            margin: "36px 0",
          }}
        />

        {/* Metadata grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* MOST RECENTLY */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr",
              gap: "0 16px",
              paddingBottom: 20,
              marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={labelStyle}>Most recently</span>
            <span
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#3A3A3A",
                lineHeight: 1.5,
              }}
            >
              Product Designer &amp; Strategist at ProductStak
            </span>
          </div>

          {/* LOOKING FOR */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr",
              gap: "0 16px",
              paddingBottom: 20,
              marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={labelStyle}>Looking for</span>
            <span
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#3A3A3A",
                lineHeight: 1.6,
              }}
            >
              A role where strategy and implementation are not separate jobs.
              Fast-moving, iterative, genuinely trying to build something that
              matters. Industry matters less than energy.
            </span>
          </div>

          {/* AVAILABLE NOW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr",
              gap: "0 16px",
              paddingBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#F35900",
                lineHeight: 1.4,
              }}
            >
              Available now
            </span>
            <span></span>
          </div>
        </div>

        {/* Links row */}
        <div
          style={{
            display: "flex",
            gap: 0,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {[
            { label: "Email",     href: "mailto:harsha@harshapillai.com" },
            { label: "LinkedIn",  href: "https://linkedin.com/in/harshapillai" },
            { label: "Read.cv",   href: "https://read.cv/harshapillai" },
          ].map(({ label, href }, i, arr) => (
            <span key={label} style={{ display: "flex", alignItems: "center" }}>
              <a
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "-0.04em",
                  color: "#3A3A3A",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#F35900"; }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#3A3A3A"; }}
              >
                {label}
              </a>
              {i < arr.length - 1 && (
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12,
                    color: "rgba(58,58,58,0.3)",
                    margin: "0 10px",
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Right column — DesignPhilosophy constellation */}
      <div className="about-constellation" style={{ flex: "0 0 40%", height: "100vh", overflow: "hidden" }}>
        <DesignPhilosophy />
      </div>
    </div>
  );
}
