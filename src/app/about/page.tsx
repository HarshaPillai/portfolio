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
