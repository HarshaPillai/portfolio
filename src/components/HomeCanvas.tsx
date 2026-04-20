"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  {
    name: "Care+",
    client: "SVA",
    year: "2024",
    about: "Empowering nurses to reclaim time through a community program connecting them with high school student volunteers",
    tags: ["#ACADEMIC", "#SERVICE DESIGN", "#HEALTH"],
  },
  {
    name: "Strava x Recover Athletics",
    client: "SVA",
    year: "2023",
    about: "Integrating athlete rehabilitation features into Strava through an imagined partnership with Recover Athletics",
    tags: ["#ACADEMIC", "#PRODUCT DESIGN", "#HEALTH"],
  },
  {
    name: "Lost in Translation",
    client: "SVA MFA Thesis",
    year: "2025",
    about: "Rethinking expressions of care across distances — exploring intergenerational and intercultural communication within Asian immigrant families",
    tags: ["#THESIS", "#RESEARCH", "#SERVICE DESIGN"],
  },
];

const N            = PROJECTS.length;
const TWO_PI       = Math.PI * 2;
const RADIUS_X     = 320;
const RADIUS_Y     = 200;
const ACTIVE_ANGLE = Math.PI; // 9 o'clock (leftmost)
const WIDTH_MIN    = 120;
const WIDTH_RANGE  = 480; // 120 + 480 = 600 at full proximity
const ASPECT       = 0.667;
const META_THRESH  = 0.92;
const META_W       = 220;

// Intro state constants — preserved for when intro is re-added
// const INTRO_W = 200; const INTRO_H = 140; const INTRO_BLUR = 4; const INTRO_OPACITY = 0.5;
// const INTRO_POSITIONS = [{ left:0.28, top:0.12 },{ left:0.43, top:0.08 },{ left:0.18, top:0.33 },
//   { left:0.62, top:0.28 },{ left:0.26, top:0.60 },{ left:0.43, top:0.72 },{ left:0.62, top:0.58 }];

function MetaRow({
  label, value, mono,
}: {
  label: string; value: string; mono?: boolean;
}) {
  return (
    <div style={{
      borderBottom: "1px solid #E5E5E5",
      paddingTop: 12, paddingBottom: 12,
      display: "grid", gridTemplateColumns: "60px 1fr",
      gap: "0 10px", alignItems: "start",
    }}>
      <span style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 10, letterSpacing: "-0.09em",
        color: "rgba(58,58,58,0.5)", textTransform: "uppercase", paddingTop: 3,
      }}>{label}</span>
      <span style={{
        fontFamily: mono
          ? "var(--font-dm-mono), monospace"
          : "var(--font-jakarta), system-ui, sans-serif",
        fontSize: mono ? 11 : 16, fontWeight: 500,
        color: mono ? "#B5B5B5" : "#3A3A3A",
        letterSpacing: mono ? "-0.09em" : "-0.05em",
        lineHeight: 1.45, display: "flex", alignItems: "center",
        flexWrap: "wrap", gap: 4,
      }}>
        {value}
      </span>
    </div>
  );
}

export default function HomeCanvas() {
  const outerRef        = useRef<HTMLDivElement>(null);
  const stickyRef       = useRef<HTMLDivElement>(null);
  const frameRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef         = useRef<HTMLDivElement>(null);
  const scrollProgRef   = useRef(0);
  const lastActiveI     = useRef(-1);
  const debugEllipseRef = useRef<SVGEllipseElement>(null);
  const frameCountRef   = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    function render(scrollProg: number) {
      const w  = sticky.offsetWidth;
      const h  = sticky.offsetHeight;
      // Coordinates are container-relative: (0,0) = sticky div top-left corner.
      const cx = w * 0.60;
      const cy = h * 0.50;

      // One-time diagnostic on first call
      if (frameCountRef.current === 0) {
        console.log("ORBIT CONSTANTS:", { cx: cx.toFixed(0), cy: cy.toFixed(0), radiusX: RADIUS_X, radiusY: RADIUS_Y, containerW: w, containerH: h });
        console.log("ANGLES:", PROJECTS.map((_, i) => ((i / N) * TWO_PI).toFixed(3)));
        console.log("POSITIONS:", PROJECTS.map((_, i) => {
          const angle = (i / N) * TWO_PI;
          return { x: (cx + Math.cos(angle) * RADIUS_X).toFixed(0), y: (cy + Math.sin(angle) * RADIUS_Y).toFixed(0) };
        }));
      }
      frameCountRef.current++;

      // Update debug ellipse overlay
      const dbgEl = debugEllipseRef.current;
      if (dbgEl) {
        dbgEl.setAttribute("cx", cx.toFixed(0));
        dbgEl.setAttribute("cy", cy.toFixed(0));
        dbgEl.setAttribute("rx", String(RADIUS_X));
        dbgEl.setAttribute("ry", String(RADIUS_Y));
      }

      // scrollProg 0→1 drives 0→1.25 full rotations
      const orbitRp = scrollProg * 1.25;

      let bestP = -1, bestI = 0;
      let bestX = 0, bestY = 0, bestW = 0, bestH = 0;
      let dbgX0 = 0, dbgY0 = 0;

      for (let i = 0; i < N; i++) {
        const ang       = (i / N) * TWO_PI + orbitRp * TWO_PI;
        const x         = cx + Math.cos(ang) * RADIUS_X;
        const y         = cy + Math.sin(ang) * RADIUS_Y;
        if (i === 0) { dbgX0 = x; dbgY0 = y; }
        const proximity = (Math.cos(ang - ACTIVE_ANGLE) + 1) / 2;
        const width     = WIDTH_MIN + proximity * WIDTH_RANGE;
        const height    = width * ASPECT;

        const el = frameRefs.current[i];
        if (el) {
          gsap.set(el, {
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            filter: `blur(${(1 - proximity) * 8}px)`,
            opacity: 0.35 + proximity * 0.65,
            zIndex: Math.round(proximity * 10),
          });
        }

        if (proximity > bestP) {
          bestP = proximity; bestI = i;
          bestX = x; bestY = y; bestW = width; bestH = height;
        }
      }

      if (bestI !== lastActiveI.current) {
        lastActiveI.current = bestI;
        setActiveIndex(bestI);
      }

      const metaEl = metaRef.current;
      if (metaEl) {
        const mo = bestP > META_THRESH ? (bestP - META_THRESH) / (1 - META_THRESH) : 0;
        gsap.set(metaEl, {
          opacity: mo,
          x: Math.max(0, bestX - bestW / 2 - META_W - 16),
          y: bestY - bestH / 2,
          pointerEvents: mo > 0 ? "auto" : "none",
        });
      }

      if (frameCountRef.current % 10 === 0) {
        console.log(
          "thumb 0 pos:", dbgX0.toFixed(0), dbgY0.toFixed(0),
          "| orbit center:", cx.toFixed(0), cy.toFixed(0),
          "| radii:", RADIUS_X, RADIUS_Y,
          "| container:", w, h,
        );
      }
    }

    const st = ScrollTrigger.create({
      trigger: outer,
      start:   "top top",
      end:     "bottom bottom",
      scrub:   1,
      onUpdate: (self: ScrollTrigger) => {
        scrollProgRef.current = self.progress;
        render(self.progress);
      },
    });

    // Set intro state immediately — must run after ScrollTrigger is registered
    // so any ScrollTrigger.refresh() calls don't overwrite it
    render(0);

    const onResize = () => render(scrollProgRef.current);
    window.addEventListener("resize", onResize);
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const proj = PROJECTS[activeIndex];

  return (
    <div ref={outerRef} style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* Carousel frames — hidden until render(0) sets intro positions */}
        {PROJECTS.map((_, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { frameRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "#C4C4C4",
              opacity: 0,
              willChange: "transform, width, height, opacity, filter",
            }}
          />
        ))}

        {/* Metadata panel — GSAP controls position + opacity, React controls content */}
        <div
          ref={metaRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: META_W,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div key={activeIndex} style={{ animation: "metaFadeIn 0.3s ease" }}>
            <MetaRow label="Project" value={proj.name} />
            <MetaRow label="Client"  value={proj.client} />
            <MetaRow label="Year"    value={proj.year} />
            <MetaRow label="About"   value={proj.about} />
            <MetaRow label="Tags"    value={proj.tags.join("  ")} mono />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, right: 32, zIndex: 25,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 11, letterSpacing: "-0.09em",
          color: "#B5B5B5", userSelect: "none",
        }}>
          SCROLL&nbsp;
          <span style={{ display: "inline-block", animation: "scrollBounce 1.5s ease-in-out infinite" }}>
            ↓
          </span>
        </div>

        {/* DEBUG: ellipse path overlay — remove once orbit is confirmed */}
        <svg style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 99,
        }}>
          <ellipse
            ref={debugEllipseRef}
            fill="none"
            stroke="red"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
