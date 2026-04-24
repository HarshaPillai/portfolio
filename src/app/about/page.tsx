"use client";

import React from "react";
import DesignPhilosophy from "@/components/DesignPhilosophy";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function O(props: any) {
  return <span style={{ color: "#F35900", fontWeight: 600 }}>{props.children}</span>;
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: 15, fontWeight: 500, letterSpacing: "-0.03em",
  color: "#3A3A3A", lineHeight: 1.8, margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 10, letterSpacing: "0.02em",
  color: "rgba(58,58,58,0.45)", textTransform: "uppercase", lineHeight: 1.4,
};

export default function AboutPage() {
  return (
    <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>

      {/* Left column — bio only, scrolls with page */}
      <div style={{ flex: 1, padding: "60px 0 80px 60px", minWidth: 0 }}>

        {/* Opening line */}
        <p style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 20, fontWeight: 500, fontStyle: "italic",
          letterSpacing: "-0.03em", color: "#3A3A3A",
          lineHeight: 1.5, margin: "0 0 28px 0",
        }}>
          Before product design, Harsha was an{" "}
          <O>architectural designer</O>, an <O>engineer</O>, a{" "}
          <O>competitive dancer</O>, and a kid obsessed with puzzles.
        </p>

        {/* Bio paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={bodyStyle}>
            Born in Switzerland, raised in Germany, of Indian heritage, she
            moves naturally between cultures, languages, and ways of seeing.
            That ever-shifting perspective shaped her approach: design deeply
            rooted in <O>systems thinking</O>, and in <O>care</O> for the
            people at the center of it all.
          </p>
          <p style={bodyStyle}>
            With 3+ years in product, she has experience across consumer, B2B,
            and integrated platforms. What she cares about most is designing
            with consequences in mind. In a world where anything can be built,
            the question isn&apos;t can we, but rather <O>should we</O>.
          </p>
          <p style={bodyStyle}>
            Outside of design, you&apos;ll find her throwing punches in kickboxing
            class, rooting for the NY Knicks, or keeping her NYT Connections
            streak alive.
          </p>
        </div>
      </div>

      {/* Right column — orbit diagram + status, sticky */}
      <div style={{
        flex: 1,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "visible",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 60px 60px 0",
      }}>
        <DesignPhilosophy />
      </div>
    </div>
  );
}
