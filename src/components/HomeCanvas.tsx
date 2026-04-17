"use client";

import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    name: "Stealth Field Ops SaaS",
    client: "Undisclosed",
    year: "2025",
    about: "End-to-end design system and IA for a residential GC operations platform",
    tags: ["#SAAS", "#AI", "#CLIENT"],
  },
  {
    name: "Stealth Invoicing Platform",
    client: "Undisclosed",
    year: "2025",
    about: "Contractor and client portal for construction job lifecycle management",
    tags: ["#SAAS", "#FINTECH", "#CLIENT"],
  },
  {
    name: "B2B Operations Platform",
    client: "Undisclosed",
    year: "2024",
    about: "Workflow automation and AI command center for real estate operations",
    tags: ["#SAAS", "#B2B", "#CLIENT"],
  },
  {
    name: "Dream-Match",
    client: "SVA Thesis",
    year: "2025",
    about: "Reimagining career exploration for high schoolers through values-based matching",
    tags: ["#ACADEMIC", "#UX", "#RESEARCH"],
  },
];

const RX = 340;
const RY = 160;
const ARROW_SIZE = 44;
// Height of the active frame (dist=0): width=580, 16:9
const ACTIVE_H = 580 * (9 / 16);

function frameProps(fa: number) {
  const TWO_PI = Math.PI * 2;
  const norm = ((fa % TWO_PI) + TWO_PI) % TWO_PI;
  const dist = Math.min(norm, TWO_PI - norm) / Math.PI; // 0=active 1=opposite
  const width = 580 - 380 * dist;
  const height = width * (9 / 16);
  const blur = dist * 8;
  const opacity = 1 - dist * 0.6;
  const zIndex = Math.round(10 - dist * 10);
  return { width, height, blur, opacity, zIndex };
}

function getActiveIndex(ga: number): number {
  const TWO_PI = Math.PI * 2;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < 4; i++) {
    const fa = ga + i * (Math.PI / 2);
    const norm = ((fa % TWO_PI) + TWO_PI) % TWO_PI;
    const dist = Math.min(norm, TWO_PI - norm);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function MetaRow({
  label,
  value,
  link,
  mono,
}: {
  label: string;
  value: string;
  link?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid #E5E5E5",
        paddingTop: 12,
        paddingBottom: 12,
        display: "grid",
        gridTemplateColumns: "60px 1fr",
        gap: "0 10px",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10,
          letterSpacing: "-0.09em",
          color: "rgba(58,58,58,0.5)",
          textTransform: "uppercase",
          paddingTop: 3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono
            ? "var(--font-dm-mono), monospace"
            : "var(--font-jakarta), system-ui, sans-serif",
          fontSize: mono ? 11 : 16,
          fontWeight: 500,
          color: mono ? "#B5B5B5" : "#3A3A3A",
          letterSpacing: mono ? "-0.09em" : "-0.05em",
          lineHeight: 1.45,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {value}
        {link && <span style={{ color: "#F35900" }}>↗</span>}
      </span>
    </div>
  );
}

export default function HomeCanvas() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [angle, setAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [textGone, setTextGone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const gaRef = useRef(0);   // smoothed global angle
  const taRef = useRef(0);   // target angle
  const rafRef = useRef<number | null>(null);
  const lastActiveRef = useRef(0);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Continuous animation loop — lerps globalAngle toward targetAngle
  useEffect(() => {
    const tick = () => {
      const next = gaRef.current + (taRef.current - gaRef.current) * 0.08;
      gaRef.current = next;

      const active = getActiveIndex(next);
      if (active !== lastActiveRef.current) {
        lastActiveRef.current = active;
        setActiveIndex(active);
      }

      setAngle(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Wheel handler — drives targetAngle directly
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      taRef.current += e.deltaY * 0.004;
      if (Math.abs(taRef.current) > 0.3) setTextGone(true);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  // Active frame is always at the rightmost point of the ellipse
  const activeCX = cx + RX;

  const textOpacity = textGone ? 0 : Math.max(0, 1 - Math.abs(angle) / 0.3);
  const proj = PROJECTS[activeIndex];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Carousel frames — ONE system, always visible ─────────────────────── */}
      {size.w > 0 &&
        PROJECTS.map((_, i) => {
          const fa = angle + i * (Math.PI / 2);
          const x = cx + RX * Math.cos(fa);
          const y = cy + RY * Math.sin(fa);
          const { width, height, blur, opacity, zIndex } = frameProps(fa);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - width / 2,
                top: y - height / 2,
                width,
                height,
                backgroundColor: "#C4C4C4",
                filter: `blur(${blur}px)`,
                opacity,
                zIndex,
              }}
            />
          );
        })}

      {/* ── Positioning text — fades as carousel rotates, never returns ───────── */}
      {textOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            textAlign: "center",
            pointerEvents: "none",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "-0.05em",
            lineHeight: 1.4,
            color: "#3A3A3A",
            opacity: textOpacity,
            zIndex: 15,
          }}
        >
          Harsha is an{" "}
          <span style={{ color: "#F35900" }}>end-to-end designer</span>
          {". "}She thinks in systems, designs for people, and ships with AI.
        </div>
      )}

      {/* ── Metadata panel — appears once text is gone ────────────────────────── */}
      {textGone && (
        <div
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%)",
            width: 280,
            zIndex: 20,
            animation: "metaFadeIn 0.3s ease",
          }}
        >
          <div key={activeIndex} style={{ animation: "metaFadeIn 0.3s ease" }}>
            <MetaRow label="Project" value={proj.name} link />
            <MetaRow label="Client" value={proj.client} />
            <MetaRow label="Year" value={proj.year} />
            <MetaRow label="About" value={proj.about} />
            <MetaRow label="Tags" value={proj.tags.join("  ")} mono />
          </div>
        </div>
      )}

      {/* ── Up / down arrows — above and below active frame position ─────────── */}
      {textGone && size.w > 0 && (
        <>
          <button
            onClick={() => {
              taRef.current -= Math.PI / 2;
            }}
            aria-label="Previous project"
            style={{
              position: "absolute",
              left: activeCX - ARROW_SIZE / 2,
              top: cy - ACTIVE_H / 2 - ARROW_SIZE - 16,
              width: ARROW_SIZE,
              height: ARROW_SIZE,
              borderRadius: "50%",
              backgroundColor: "#0A0A0A",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 11V3M3 6.5l4-4 4 4"
                stroke="white"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              taRef.current += Math.PI / 2;
            }}
            aria-label="Next project"
            style={{
              position: "absolute",
              left: activeCX - ARROW_SIZE / 2,
              top: cy + ACTIVE_H / 2 + 16,
              width: ARROW_SIZE,
              height: ARROW_SIZE,
              borderRadius: "50%",
              backgroundColor: "#0A0A0A",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 3v8M3 7.5l4 4 4-4"
                stroke="white"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* ── SCROLL indicator ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          zIndex: 25,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 11,
          letterSpacing: "-0.09em",
          color: "#B5B5B5",
          userSelect: "none",
        }}
      >
        SCROLL&nbsp;
        <span
          style={{
            display: "inline-block",
            animation: "scrollBounce 1.5s ease-in-out infinite",
          }}
        >
          ↓
        </span>
      </div>
    </div>
  );
}
