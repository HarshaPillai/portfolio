"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Project data ─────────────────────────────────────────────────────────────
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

// ─── Intro scatter positions (fractions of canvas W/H + fixed px sizes) ──────
const SCATTER = [
  { xf: 0.10, yf: 0.08, w: 210, h: 160 },
  { xf: 0.35, yf: 0.05, w: 170, h: 128 },
  { xf: 0.02, yf: 0.28, w: 200, h: 155 },
  { xf: 0.56, yf: 0.25, w: 158, h: 122 },
  { xf: 0.10, yf: 0.52, w: 192, h: 148 },
  { xf: 0.52, yf: 0.50, w: 162, h: 128 },
  { xf: 0.26, yf: 0.72, w: 168, h: 132 },
  { xf: 0.60, yf: 0.70, w: 150, h: 118 },
];

// ─── Orbit ────────────────────────────────────────────────────────────────────
// Screen-clockwise: 0°=right 90°=bottom 180°=left(ACTIVE) 270°=top
// Frame 0 starts at active (180°). CW rotation brings frame 1 (at 90°) to active.
// START_ANGLES[i] = initial angle; at rotDeg=0, frame 0 is already active.
const START_ANGLES = [180, 90, 0, 270];

// Size/blur/opacity at angular distances 0° (active), 90° (adjacent), 180° (opposite)
function interpDist(v0: number, v1: number, v2: number, dist: number): number {
  const t = Math.min(dist / 90, 2);
  return t <= 1 ? v0 + (v1 - v0) * t : v1 + (v2 - v1) * (t - 1);
}

// ─── MetaRow ──────────────────────────────────────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeCanvas() {
  const [activeProject, setActiveProject] = useState(0);

  const containerRef    = useRef<HTMLDivElement>(null);
  const introLayerRef   = useRef<HTMLDivElement>(null);
  const orbitLayerRef   = useRef<HTMLDivElement>(null);
  const scatterRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const upBtnRef        = useRef<HTMLButtonElement>(null);
  const downBtnRef      = useRef<HTMLButtonElement>(null);
  const stRef           = useRef<ScrollTrigger | null>(null);
  const lastProjRef     = useRef(0);
  const activeProjRef   = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const cW = container.offsetWidth;
    const cH = container.offsetHeight;
    if (!cW || !cH) return;

    let mounted = true;

    // ── Scatter frame positions ────────────────────────────────────────────────
    SCATTER.forEach((pos, i) => {
      const el = scatterRefs.current[i];
      if (!el) return;
      gsap.set(el, {
        left: pos.xf * cW,
        top: pos.yf * cH,
        width: pos.w,
        height: pos.h,
        filter: "blur(3px)",
        opacity: 0.7,
      });
    });

    // ── Orbit geometry ─────────────────────────────────────────────────────────
    const rx = 320;
    const ry = 180;
    // Place active frame center at 67% of canvas width
    const activeCX = cW * 0.67;
    const orbitCX  = activeCX + rx; // at 180°: cos(180°)=-1 → ex = orbitCX - rx = activeCX ✓
    const orbitCY  = cH / 2;

    const ACTIVE_W = Math.min(600, cW * 0.52);
    const ACTIVE_H = 380;
    const ADJ_W    = 380;
    const ADJ_H    = 240;
    const OPP_W    = 240;
    const OPP_H    = 152;

    // Arrow positions: centred above/below the active frame
    const arrowSize = 44;
    if (upBtnRef.current) {
      gsap.set(upBtnRef.current, {
        left: activeCX - arrowSize / 2,
        top: orbitCY - ACTIVE_H / 2 - arrowSize - 16,
      });
    }
    if (downBtnRef.current) {
      gsap.set(downBtnRef.current, {
        left: activeCX - arrowSize / 2,
        top: orbitCY + ACTIVE_H / 2 + 16,
      });
    }

    // Orbital layer starts hidden; intro layer starts visible (default)
    gsap.set(orbitLayerRef.current, { opacity: 0, pointerEvents: "none" });

    // ── Orbit update ───────────────────────────────────────────────────────────
    const updateOrbit = (rotDeg: number) => {
      let closestDist = Infinity;
      let closestIdx  = 0;

      orbitRefs.current.forEach((frame, i) => {
        if (!frame) return;

        const angle = ((START_ANGLES[i] + rotDeg) % 360 + 360) % 360;
        const rad   = (angle * Math.PI) / 180;
        const ex    = orbitCX + rx * Math.cos(rad);
        const ey    = orbitCY + ry * Math.sin(rad);

        // Angular distance from active (180°), clamped 0–180
        let dist = ((angle - 180) + 360) % 360;
        if (dist > 180) dist = 360 - dist;

        if (dist < closestDist) { closestDist = dist; closestIdx = i; }

        const w    = interpDist(ACTIVE_W, ADJ_W, OPP_W, dist);
        const h    = interpDist(ACTIVE_H, ADJ_H, OPP_H, dist);
        const blur = interpDist(0, 2, 5, dist);
        const op   = interpDist(1.0, 0.75, 0.5, dist);
        const z    = Math.round(interpDist(10, 5, 1, dist));

        gsap.set(frame, {
          left:    ex - w / 2,
          top:     ey - h / 2,
          width:   w,
          height:  h,
          filter:  `blur(${blur}px)`,
          opacity: op,
          zIndex:  z,
        });
      });

      if (closestIdx !== lastProjRef.current) {
        lastProjRef.current  = closestIdx;
        activeProjRef.current = closestIdx;
        if (mounted) setActiveProject(closestIdx);
      }
    };

    updateOrbit(0);

    // ── ScrollTrigger ──────────────────────────────────────────────────────────
    // 800vh total. First 30vh fades intro→orbital. Remaining 770vh = 360° rotation.
    const TOTAL_VH      = 800;
    const TRANSITION_VH = 30;
    const TRANS_FRAC    = TRANSITION_VH / TOTAL_VH;

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger:    container,
        start:      "top top",
        end:        `+=${TOTAL_VH}vh`,
        pin:        true,
        pinSpacing: true,
        scrub:      1.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Crossfade intro ↔ orbital over first 30vh
          const tf = Math.min(p / TRANS_FRAC, 1);
          gsap.set(introLayerRef.current, { opacity: 1 - tf });
          gsap.set(orbitLayerRef.current, {
            opacity:       tf,
            pointerEvents: tf > 0.5 ? "auto" : "none",
          });

          // Rotation: 360° spread across full 800vh
          updateOrbit(p * 360);
        },
      });
    });

    return () => {
      mounted = false;
      ctx.revert();
      stRef.current = null;
    };
  }, []);

  const scrollToProject = (idx: number) => {
    const st = stRef.current;
    if (!st) return;
    const targetY = st.start + (idx / 4) * (st.end - st.start);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const proj = PROJECTS[activeProject];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Intro layer: 8 scattered thumbnails + positioning text ──────────── */}
      <div ref={introLayerRef} className="absolute inset-0" style={{ zIndex: 5 }}>
        {SCATTER.map((_, i) => (
          <div
            key={i}
            ref={(el) => { scatterRefs.current[i] = el; }}
            className="absolute bg-[#C4C4C4]"
          />
        ))}

        <div
          style={{
            position:   "absolute",
            left:       "50%",
            top:        "52%",
            transform:  "translate(-50%, -50%)",
            width:      380,
            textAlign:  "center",
            pointerEvents: "none",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize:   22,
            fontWeight: 500,
            letterSpacing: "-0.05em",
            lineHeight: 1.4,
            color:      "#3A3A3A",
          }}
        >
          Harsha is an{" "}
          <span style={{ color: "#F35900" }}>end-to-end designer</span>
          {". "}She thinks in systems, designs for people, and ships with AI.
        </div>
      </div>

      {/* ── Orbital layer: 4 orbit frames + metadata + arrows ───────────────── */}
      <div ref={orbitLayerRef} className="absolute inset-0" style={{ zIndex: 10 }}>
        {/* Orbit frames — GSAP owns all visual props */}
        {PROJECTS.map((_, i) => (
          <div
            key={i}
            ref={(el) => { orbitRefs.current[i] = el; }}
            style={{ position: "absolute", backgroundColor: "#C4C4C4" }}
          />
        ))}

        {/* Metadata panel — vertically centred, left side of canvas */}
        <div
          style={{
            position:  "absolute",
            left:      24,
            top:       "50%",
            transform: "translateY(-50%)",
            width:     280,
            zIndex:    20,
          }}
        >
          {/* key re-mounts on project change, triggering metaFadeIn CSS animation */}
          <div key={activeProject} style={{ animation: "metaFadeIn 0.3s ease" }}>
            <MetaRow label="Project" value={proj.name} link />
            <MetaRow label="Client"  value={proj.client} />
            <MetaRow label="Year"    value={proj.year} />
            <MetaRow label="About"   value={proj.about} />
            <MetaRow label="Tags"    value={proj.tags.join("  ")} mono />
          </div>
        </div>

        {/* Up arrow */}
        <button
          ref={upBtnRef}
          onClick={() => scrollToProject((activeProjRef.current - 1 + 4) % 4)}
          aria-label="Previous project"
          style={{
            position:        "absolute",
            width:           44,
            height:          44,
            borderRadius:    "50%",
            backgroundColor: "#0A0A0A",
            border:          "none",
            cursor:          "pointer",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            zIndex:          30,
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

        {/* Down arrow */}
        <button
          ref={downBtnRef}
          onClick={() => scrollToProject((activeProjRef.current + 1) % 4)}
          aria-label="Next project"
          style={{
            position:        "absolute",
            width:           44,
            height:          44,
            borderRadius:    "50%",
            backgroundColor: "#0A0A0A",
            border:          "none",
            cursor:          "pointer",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            zIndex:          30,
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

      {/* ── SCROLL ↓ indicator ────────────────────────────────────────────────── */}
      <div
        style={{
          position:   "absolute",
          bottom:     32,
          right:      32,
          zIndex:     25,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize:   11,
          letterSpacing: "-0.09em",
          color:      "#B5B5B5",
          userSelect: "none",
        }}
      >
        SCROLL&nbsp;
        <span
          style={{
            display:   "inline-block",
            animation: "scrollBounce 1.5s ease-in-out infinite",
          }}
        >
          ↓
        </span>
      </div>
    </div>
  );
}
