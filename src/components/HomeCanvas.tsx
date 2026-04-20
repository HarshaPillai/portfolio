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
const RADIUS_X     = 480;
const RADIUS_Y     = 260;
const ACTIVE_ANGLE = Math.PI; // 9 o'clock (leftmost)
const WIDTH_MIN    = 100;
const WIDTH_RANGE  = 320; // 100 + 320 = 420 at full proximity
const ASPECT       = 0.667;
const META_THRESH  = 0.92;
const META_W       = 220;

// Intro state
const INTRO_W       = 180;
const INTRO_H       = 120;
const INTRO_BLUR    = 4;
const INTRO_OPACITY = 0.5;
const INTRO_END     = 0.15; // scroll progress at which orbit begins

const INTRO_POSITIONS = [
  { left: 0.28, top: 0.12 },
  { left: 0.43, top: 0.08 },
  { left: 0.18, top: 0.33 },
  { left: 0.62, top: 0.28 },
  { left: 0.26, top: 0.60 },
  { left: 0.43, top: 0.72 },
  { left: 0.62, top: 0.58 },
];

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
  const outerRef      = useRef<HTMLDivElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const frameRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef       = useRef<HTMLDivElement>(null);
  const introTextRef  = useRef<HTMLDivElement>(null);
  const scrollProgRef = useRef(0);
  const lastActiveI   = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    function render(scrollProg: number) {
      const w  = sticky.offsetWidth;
      const h  = sticky.offsetHeight;
      const cx = w * 0.72;
      const cy = h * 0.50;

      if (scrollProg < INTRO_END) {
        // ── Intro: scatter → orbit (single smoothstep, all properties) ────────
        const t    = scrollProg / INTRO_END;
        const ease = t * t * (3 - 2 * t); // smoothstep

        for (let i = 0; i < N; i++) {
          const orbitAng  = (i / N) * TWO_PI;
          const orbitX    = cx + Math.cos(orbitAng) * RADIUS_X;
          const orbitY    = cy + Math.sin(orbitAng) * RADIUS_Y;
          const proximity = (Math.cos(orbitAng - ACTIVE_ANGLE) + 1) / 2;
          const orbitW    = WIDTH_MIN + proximity * WIDTH_RANGE;
          const orbitH    = orbitW * ASPECT;

          const introX = INTRO_POSITIONS[i].left * w;
          const introY = INTRO_POSITIONS[i].top * h;

          const x      = introX + (orbitX - introX) * ease;
          const y      = introY + (orbitY - introY) * ease;
          const width  = INTRO_W + (orbitW - INTRO_W) * ease;
          const height = INTRO_H + (orbitH - INTRO_H) * ease;
          const blur   = INTRO_BLUR + ((1 - proximity) * 8 - INTRO_BLUR) * ease;
          const op     = INTRO_OPACITY + ((0.35 + proximity * 0.65) - INTRO_OPACITY) * ease;

          const el = frameRefs.current[i];
          if (el) {
            gsap.set(el, {
              x: x - width / 2,
              y: y - height / 2,
              width,
              height,
              filter: `blur(${blur}px)`,
              opacity: op,
              zIndex: Math.round(proximity * 10),
            });
          }
        }

        // Intro text fades to 0 by 10% of scroll range
        const textEl = introTextRef.current;
        if (textEl) {
          textEl.style.opacity = String(Math.max(0, 1 - scrollProg / (INTRO_END * 0.67)));
        }

        const metaEl = metaRef.current;
        if (metaEl) gsap.set(metaEl, { opacity: 0, pointerEvents: "none" });

      } else {
        // ── Orbit: scrollProg 0.15→1.0 maps to 0→1.25 rotations ─────────────
        const orbitRp = ((scrollProg - INTRO_END) / (1 - INTRO_END)) * 1.25;

        const textEl = introTextRef.current;
        if (textEl) textEl.style.opacity = "0";

        let bestP = -1, bestI = 0;
        let bestX = 0, bestY = 0, bestW = 0, bestH = 0;

        for (let i = 0; i < N; i++) {
          const ang       = (i / N) * TWO_PI + orbitRp * TWO_PI;
          const x         = cx + Math.cos(ang) * RADIUS_X;
          const y         = cy + Math.sin(ang) * RADIUS_Y;
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
        {/* Carousel frames */}
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

        {/* Intro text — fades out as orbit begins */}
        <div
          ref={introTextRef}
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
            opacity: 0,
            zIndex: 15,
          }}
        >
          Harsha is an{" "}
          <span style={{ color: "#E8420A" }}>end-to-end designer</span>
          {". "}She thinks in systems, designs for people, and ships with AI.
        </div>

        {/* Metadata panel */}
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
      </div>
    </div>
  );
}
