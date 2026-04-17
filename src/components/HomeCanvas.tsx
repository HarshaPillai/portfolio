"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

const ORBIT_RX = 320;
const ORBIT_RY = 180;
const INTRO_RX = 340;
const INTRO_RY = 190;
const ACTIVE_W = 580;
const ACTIVE_H = 360;
const ADJ_W = 360;
const ADJ_H = 225;
const OPP_W = 200;
const OPP_H = 125;
const ARROW_SIZE = 44;
// 4 projects, 3 quarter-turn advances from entry
const MAX_ANGLE = 0.5 + 3 * (Math.PI / 2);

function interpDist(v0: number, v1: number, v2: number, distDeg: number): number {
  const t = Math.min(distDeg / 90, 2);
  return t <= 1 ? v0 + (v1 - v0) * t : v1 + (v2 - v1) * (t - 1);
}

function angleDist(frameAngle: number): number {
  const TWO_PI = 2 * Math.PI;
  const norm = ((frameAngle % TWO_PI) + TWO_PI) % TWO_PI;
  let dist = Math.abs(norm - Math.PI);
  if (dist > Math.PI) dist = TWO_PI - dist;
  return (dist * 180) / Math.PI;
}

function getActiveFromAngle(angle: number): number {
  let minDist = Infinity;
  let active = 0;
  for (let i = 0; i < 4; i++) {
    const d = angleDist(Math.PI + i * (Math.PI / 2) - angle);
    if (d < minDist) {
      minDist = d;
      active = i;
    }
  }
  return active;
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
  const [angle, setAngle] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Derived state — no separate useState needed
  const phase = angle >= 0.5 ? "orbit" : "intro";
  const activeIndex = phase === "orbit" ? getActiveFromAngle(angle) : 0;
  const introProgress = Math.min(angle / 0.5, 1);

  // Orbit geometry (only valid when size is known)
  const orbitCX = size.w * 0.67 + ORBIT_RX;
  const orbitCY = size.h / 2;
  const activeCX = orbitCX - ORBIT_RX; // = size.w * 0.67

  // Arrow positions: centred above/below the active frame
  const upArrowLeft = activeCX - ARROW_SIZE / 2;
  const upArrowTop = orbitCY - ACTIVE_H / 2 - ARROW_SIZE - 16;
  const downArrowLeft = activeCX - ARROW_SIZE / 2;
  const downArrowTop = orbitCY + ACTIVE_H / 2 + 16;

  const isAtMax = angle >= MAX_ANGLE - 0.05;

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

  // Wheel handler — drives angle directly, no ScrollTrigger
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setAngle((prev) => {
        const next = Math.max(0, Math.min(MAX_ANGLE, prev + e.deltaY * 0.003));
        angleRef.current = next;
        return next;
      });
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Smooth eased animation for arrow buttons
  const animateTo = useCallback((target: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const clamped = Math.max(0, Math.min(MAX_ANGLE, target));
    const startAngle = angleRef.current;
    const startTime = performance.now();
    const duration = 600;
    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const current = startAngle + (clamped - startAngle) * easeOut(t);
      angleRef.current = current;
      setAngle(current);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const proj = PROJECTS[activeIndex];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Intro layer ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          opacity: phase === "orbit" ? 0 : 1 - introProgress,
          pointerEvents: phase === "orbit" ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* 8 thumbnails on ellipse, rotating clockwise as angle increases */}
        {size.w > 0 &&
          Array.from({ length: 8 }, (_, i) => {
            const baseA = (i / 8) * 2 * Math.PI;
            const rotated = baseA + introProgress * (Math.PI / 4);
            const cx = size.w / 2 + INTRO_RX * Math.cos(rotated);
            const cy = size.h / 2 + INTRO_RY * Math.sin(rotated);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 160,
                  height: 110,
                  left: cx - 80,
                  top: cy - 55,
                  backgroundColor: "#C4C4C4",
                  filter: "blur(4px)",
                  opacity: 0.6,
                }}
              />
            );
          })}

        {/* Positioning text — fades out as angle increases */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
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
            opacity: 1 - introProgress,
          }}
        >
          Harsha is an{" "}
          <span style={{ color: "#F35900" }}>end-to-end designer</span>
          {". "}She thinks in systems, designs for people, and ships with AI.
        </div>
      </div>

      {/* ── Orbit layer ─────────────────────────────────────────────────────── */}
      {phase === "orbit" && size.w > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            animation: "metaFadeIn 0.25s ease",
          }}
        >
          {/* 4 project frames on ellipse */}
          {PROJECTS.map((_, i) => {
            const fa = Math.PI + i * (Math.PI / 2) - angle;
            const ex = orbitCX + ORBIT_RX * Math.cos(fa);
            const ey = orbitCY + ORBIT_RY * Math.sin(fa);
            const distDeg = angleDist(fa);
            const w = interpDist(ACTIVE_W, ADJ_W, OPP_W, distDeg);
            const h = interpDist(ACTIVE_H, ADJ_H, OPP_H, distDeg);
            const blur = interpDist(0, 3, 6, distDeg);
            const opacity = interpDist(1, 0.7, 0.4, distDeg);
            const zIndex = Math.round(interpDist(10, 5, 1, distDeg));
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: ex - w / 2,
                  top: ey - h / 2,
                  width: w,
                  height: h,
                  backgroundColor: "#C4C4C4",
                  filter: `blur(${blur}px)`,
                  opacity,
                  zIndex,
                }}
              />
            );
          })}

          {/* Metadata panel — crossfades on project change via key re-mount */}
          <div
            style={{
              position: "absolute",
              left: 24,
              top: "50%",
              transform: "translateY(-50%)",
              width: 280,
              zIndex: 20,
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

          {/* Up arrow */}
          <button
            onClick={() => animateTo(angleRef.current - Math.PI / 2)}
            aria-label="Previous project"
            style={{
              position: "absolute",
              left: upArrowLeft,
              top: upArrowTop,
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

          {/* Down arrow — greys out at last position */}
          <button
            onClick={() => !isAtMax && animateTo(angleRef.current + Math.PI / 2)}
            aria-label="Next project"
            style={{
              position: "absolute",
              left: downArrowLeft,
              top: downArrowTop,
              width: ARROW_SIZE,
              height: ARROW_SIZE,
              borderRadius: "50%",
              backgroundColor: "#0A0A0A",
              border: "none",
              cursor: isAtMax ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
              opacity: isAtMax ? 0.3 : 1,
              transition: "opacity 0.2s ease",
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
        </div>
      )}

      {/* ── SCROLL indicator ────────────────────────────────────────────────── */}
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
