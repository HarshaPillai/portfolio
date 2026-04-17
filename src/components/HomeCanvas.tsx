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
const RADIUS_X     = 280;
const RADIUS_Y     = 160;
const ACTIVE_ANGLE = Math.PI; // 9 o'clock (leftmost point)
const WIDTH_MIN    = 120;
const WIDTH_RANGE  = 480; // 120 + 480 = 600 at full proximity
const ASPECT       = 0.667;
const META_THRESH  = 0.92;
const META_W       = 220;

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
  const outerRef    = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const frameRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef     = useRef<HTMLDivElement>(null);
  const rotProgress = useRef(0);
  const lastActiveI = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    function render() {
      const rp = rotProgress.current;
      const w  = sticky!.offsetWidth;
      const h  = sticky!.offsetHeight;
      const cx = w * 0.65;
      const cy = h * 0.5;

      let bestP = -1, bestI = 0;
      let bestX = 0, bestY = 0, bestW = 0, bestH = 0;

      for (let i = 0; i < N; i++) {
        const ang       = (i / N) * TWO_PI + rp * TWO_PI;
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
        const mo       = bestP > META_THRESH ? (bestP - META_THRESH) / (1 - META_THRESH) : 0;
        const metaLeft = Math.max(0, bestX - bestW / 2 - META_W - 16);
        const metaTop  = bestY - bestH / 2;
        gsap.set(metaEl, {
          opacity: mo,
          x: metaLeft,
          y: metaTop,
          pointerEvents: mo > 0 ? "auto" : "none",
        });
      }
    }

    const st = ScrollTrigger.create({
      trigger: outer,
      start:   "top top",
      end:     "bottom bottom",
      scrub:   1,
      onUpdate: (self: ScrollTrigger) => {
        rotProgress.current = self.progress * 1.25;
        render();
      },
    });

    render(); // draw initial positions at progress = 0

    window.addEventListener("resize", render);
    return () => {
      st.kill();
      window.removeEventListener("resize", render);
    };
  }, []);

  const proj = PROJECTS[activeIndex];

  return (
    <div ref={outerRef} style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* Carousel frames — all properties driven imperatively by GSAP */}
        {PROJECTS.map((_, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { frameRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "#C4C4C4",
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
      </div>
    </div>
  );
}
