"use client";

import React, { useState } from "react";
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

// ─── Timeline ─────────────────────────────────────────────────────────────────
const toM = (y: number, m: number) => y * 12 + m;
const TL_MIN = toM(2016, 8);
const TL_MAX = toM(2026, 4);
const toPct = (y: number, m: number) =>
  ((toM(y, m) - TL_MIN) / (TL_MAX - TL_MIN)) * 100;

const EVENTS = [
  { sy: 2016, sm: 8,  ey: 2018, em: 5,  label: "RIT — Computer Science" },
  { sy: 2017, sm: 6,  ey: 2017, em: 8,  label: "Intern @ UNCCD — Technical Assistant" },
  { sy: 2018, sm: 1,  ey: 2018, em: 5,  label: "CSII Supplemental Instructor @ RIT" },
  { sy: 2018, sm: 8,  ey: 2023, em: 5,  label: "B.Arch @ IIT College of Architecture" },
  { sy: 2019, sm: 5,  ey: 2023, em: 5,  label: "Cofounder, Cumulus Zine" },
  { sy: 2022, sm: 6,  ey: 2023, em: 5,  label: "Intern @ OKW Architects" },
  { sy: 2023, sm: 8,  ey: 2025, em: 5,  label: "Masters @ SVA PoD" },
  { sy: 2023, sm: 9,  ey: 2023, em: 9,  label: "Exhibition Experience Designer @ PoD Gallery" },
  { sy: 2025, sm: 5,  ey: 2025, em: 5,  label: "Masters Thesis @ NYCxDesign Week" },
  { sy: 2025, sm: 7,  ey: 2025, em: 9,  label: "UX Design & Research Intern @ MarketEQ" },
  { sy: 2025, sm: 9,  ey: 2025, em: 12, label: "UI/UX Designer @ DesiHeart" },
  { sy: 2025, sm: 10, ey: 2026, em: 4,  label: "Product Designer I @ ProductStak" },
];

const YR_MARKS = [2016, 2018, 2020, 2022, 2024, 2026];

function Timeline() {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <section style={{ padding: "48px 60px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ ...labelStyle, marginBottom: 28 }}>Timeline</div>

      <div style={{ position: "relative", height: 80 }}>
        {/* Baseline */}
        <div style={{
          position: "absolute", top: 40, left: 0, right: 0,
          height: 1, backgroundColor: "rgba(0,0,0,0.08)",
        }} />

        {/* Year markers */}
        {YR_MARKS.map(y => (
          <span key={y} style={{
            position: "absolute", top: 52,
            left: `${toPct(y, 1)}%`,
            transform: "translateX(-50%)",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 9, letterSpacing: "-0.04em",
            color: "rgba(58,58,58,0.25)",
          }}>{y}</span>
        ))}

        {EVENTS.map((ev, i) => {
          const sp = toPct(ev.sy, ev.sm);
          const ep = toPct(ev.ey, ev.em);
          const isHov = hov === i;
          const isPoint = Math.abs(sp - ep) < 0.1;

          return (
            <React.Fragment key={i}>
              {/* Duration bracket */}
              {isHov && !isPoint && (
                <div style={{
                  position: "absolute", top: 0,
                  left: `${sp}%`, width: `${ep - sp}%`,
                  pointerEvents: "none", zIndex: 5,
                }}>
                  <span style={{
                    position: "absolute", top: 0, left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: 11, fontWeight: 500,
                    letterSpacing: "-0.03em", color: "#3A3A3A",
                    whiteSpace: "nowrap",
                  }}>{ev.label}</span>
                  <div style={{ position: "absolute", top: 18, left: 0, width: 1, height: 28, backgroundColor: "#F35900" }} />
                  <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 1, backgroundColor: "#F35900" }} />
                  <div style={{ position: "absolute", top: 18, right: 0, width: 1, height: 28, backgroundColor: "#F35900" }} />
                </div>
              )}

              {/* Point-event label */}
              {isHov && isPoint && (
                <div style={{
                  position: "absolute", top: 4,
                  left: `${sp}%`,
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: "-0.03em", color: "#3A3A3A",
                  whiteSpace: "nowrap",
                  pointerEvents: "none", zIndex: 5,
                }}>{ev.label}</div>
              )}

              {/* Dot */}
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  position: "absolute",
                  left: `${sp}%`, top: 40,
                  transform: isHov
                    ? "translate(-50%, -50%) scale(1.5)"
                    : "translate(-50%, -50%)",
                  width: 7, height: 7, borderRadius: "50%",
                  backgroundColor: isHov ? "#F35900" : "rgba(58,58,58,0.22)",
                  cursor: "default", zIndex: 10,
                  transition: "background-color 0.15s, transform 0.15s",
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const PEOPLE = [
  {
    initials: "PM", name: "Praney M.",
    quote: "\"A quote would go here\" about what it is like working with me, and what capacity they worked with me in. For example is it about how I'm hard working or if I am a quick learner.",
    attr: "Name LastName, Job Profession\nRelationship to me",
  },
  {
    initials: "CT", name: "Christopher T.",
    quote: "\"Working with Harsha is unlike working with anyone else\" — she brings both analytical rigor and genuine curiosity to every design problem she encounters.",
    attr: "Christopher T.\n...",
  },
  {
    initials: "AC", name: "Allan C.",
    quote: "\"Harsha embodies what it means to be in the consequence business.\" She asks the questions most designers skip, and she doesn't let go until the answer matters.",
    attr: "Allan Chochinov, Professor\nSVA Products of Design",
  },
  {
    initials: "EF", name: "Erica F.",
    quote: "\"She has a rare ability to hold complexity lightly\" — systems thinking paired with a deep instinct for what feels human.",
    attr: "Erica F.\n...",
  },
  {
    initials: "EB", name: "Emma B.",
    quote: "\"Harsha is the kind of collaborator who makes the whole team better.\" Her care for the work and the people around it is unmistakable.",
    attr: "Emma B.\n...",
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setAnimKey(k => k + 1);
  };

  const p = PEOPLE[active];

  return (
    <section style={{ padding: "48px 60px 80px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ ...labelStyle, marginBottom: 32 }}>
        Curious what working with me is like?
      </div>

      <div style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
        {/* Quote */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div key={animKey} style={{ animation: "quoteFallIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
            <p style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 20, fontWeight: 500,
              letterSpacing: "-0.04em", lineHeight: 1.5,
              color: "#3A3A3A", margin: "0 0 20px 0",
            }}>{p.quote}</p>
            <div style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11, letterSpacing: "-0.04em",
              color: "rgba(58,58,58,0.45)", lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}>-- {p.attr}</div>
          </div>
        </div>

        {/* Avatars */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: 20, width: 220,
          justifyContent: "center", flexShrink: 0,
        }}>
          {PEOPLE.map((person, i) => (
            <div key={person.initials} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => pick(i)}
                style={{
                  width: 60, height: 60, borderRadius: "50%",
                  backgroundColor: "#E8E8E8",
                  border: i === active ? "2px solid #F35900" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: 13, fontWeight: 500,
                  color: i === active ? "#F35900" : "#999",
                  letterSpacing: "-0.03em",
                  transition: "border-color 0.2s, color 0.2s",
                  padding: 0,
                }}
              >{person.initials}</button>
              <span style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 9, letterSpacing: "-0.04em",
                color: i === active ? "#3A3A3A" : "rgba(58,58,58,0.35)",
                textAlign: "center", lineHeight: 1.3,
              }}>{person.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div>
      {/* Two-column: bio + constellation */}
      <div className="about-layout" style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Left: bio */}
        <div
          className="about-bio"
          style={{
            flex: "0 0 60%",
            padding: "60px 36px 60px 60px",
            boxSizing: "border-box",
          }}
        >
          {/* Opening */}
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

          {/* Body */}
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
          <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)", margin: "36px 0" }} />

          {/* Metadata grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "110px 1fr",
              gap: "0 16px", paddingBottom: 20, marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}>
              <span style={labelStyle}>Most recently</span>
              <span style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 14, fontWeight: 500,
                letterSpacing: "-0.03em", color: "#3A3A3A", lineHeight: 1.5,
              }}>Product Designer &amp; Strategist at ProductStak</span>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "110px 1fr",
              gap: "0 16px", paddingBottom: 20, marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}>
              <span style={labelStyle}>Looking for</span>
              <span style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 14, fontWeight: 500,
                letterSpacing: "-0.03em", color: "#3A3A3A", lineHeight: 1.6,
              }}>
                A role where strategy and implementation are not separate jobs.
                Fast-moving, iterative, genuinely trying to build something that
                matters. Industry matters less than energy.
              </span>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "110px 1fr",
              gap: "0 16px", paddingBottom: 20,
            }}>
              <span style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10, letterSpacing: "0.02em",
                textTransform: "uppercase", color: "#F35900", lineHeight: 1.4,
              }}>Available now</span>
              <span />
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 0, alignItems: "center", marginTop: 8 }}>
            {[
              { label: "Email",    href: "mailto:harsha@harshapillai.com" },
              { label: "LinkedIn", href: "https://linkedin.com/in/harshapillai" },
              { label: "Read.cv",  href: "https://read.cv/harshapillai" },
            ].map(({ label, href }, i, arr) => (
              <span key={label} style={{ display: "flex", alignItems: "center" }}>
                <a
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12, letterSpacing: "-0.04em",
                    color: "#3A3A3A", textDecoration: "none", transition: "color 0.15s",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#F35900"; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#3A3A3A"; }}
                >{label}</a>
                {i < arr.length - 1 && (
                  <span style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12, color: "rgba(58,58,58,0.3)", margin: "0 10px",
                  }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right: constellation */}
        <div className="about-constellation" style={{ flex: "0 0 40%", minHeight: 560 }}>
          <DesignPhilosophy />
        </div>
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
