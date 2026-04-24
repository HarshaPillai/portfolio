"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import DesignPhilosophy from "@/components/DesignPhilosophy";
import { EnvelopeIcon } from "@/components/SocialIcons";

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

const EMAIL = "harsha.pillai98@gmail.com";

function BioParagraphs() {
  return (
    <>
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
    </>
  );
}

export default function AboutPage() {
  const [copied, setCopied]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, []);

  const contactRow = (
    <>
      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)", margin: "28px 0 20px" }} />

      {/* Most Recently */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Most Recently</div>
        <div style={bodyStyle}>Product Designer @ ProductStak</div>
      </div>

      {/* Contact */}
      <div
        style={{
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: 13, color: "#3A3A3A", lineHeight: 1.6,
          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6,
        }}
      >
        <span>Always open to a chat. Contact me at</span>
        <span onClick={handleCopy} style={{ color: "#F35900", cursor: "pointer" }}>
          {EMAIL}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy email"
          style={{
            background: "none", border: "none", padding: 0,
            cursor: "pointer", color: "#F35900",
            display: "flex", alignItems: "center",
          }}
        >
          <EnvelopeIcon size={14} />
        </button>
        {copied && (
          <span style={{ color: "#F35900", fontFamily: "var(--font-dm-mono), monospace", fontSize: 11 }}>
            Copied!
          </span>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div style={{ padding: "24px 24px 60px" }}>
        {/* Childhood photo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            overflow: "hidden", position: "relative", flexShrink: 0,
          }}>
            <Image
              src="/images/harsha-child.jpg"
              alt="Harsha as a child"
              fill
              style={{ objectFit: "cover" }}
              sizes="120px"
            />
          </div>
        </div>

        <BioParagraphs />
        {contactRow}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>

      {/* Left column — bio only, scrolls with page */}
      <div style={{ flex: 1, padding: "60px 0 80px 60px", minWidth: 0 }}>
        <BioParagraphs />
        {contactRow}
      </div>

      {/* Right column — orbit diagram, sticky */}
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
