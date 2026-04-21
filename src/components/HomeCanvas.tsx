"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PROJECTS = [
  {
    name: "Stealth Field Ops SaaS",
    client: "Undisclosed",
    year: "2025",
    about: "End-to-end design system and IA for a residential GC operations platform",
    tags: ["#SAAS", "#AI", "#CLIENT"],
    slug: "stealth-field-ops",
  },
  {
    name: "Stealth Invoicing Platform",
    client: "Undisclosed",
    year: "2025",
    about: "Contractor and client portal for construction job lifecycle management",
    tags: ["#SAAS", "#FINTECH", "#CLIENT"],
    slug: "stealth-invoicing",
  },
  {
    name: "B2B Operations Platform",
    client: "Undisclosed",
    year: "2024",
    about: "Workflow automation and AI command center for real estate operations",
    tags: ["#SAAS", "#B2B", "#CLIENT"],
    slug: "b2b-ops",
  },
  {
    name: "Dream-Match",
    client: "SVA Thesis",
    year: "2025",
    about: "Reimagining career exploration for high schoolers through values-based matching",
    tags: ["#ACADEMIC", "#UX", "#RESEARCH"],
    slug: "dream-match",
  },
  {
    name: "Care+",
    client: "SVA",
    year: "2024",
    about: "Empowering nurses to reclaim time through a community program connecting them with high school student volunteers",
    tags: ["#ACADEMIC", "#SERVICE DESIGN", "#HEALTH"],
    slug: "care-plus",
  },
  {
    name: "Strava x Recover Athletics",
    client: "SVA",
    year: "2023",
    about: "Integrating athlete rehabilitation features into Strava through an imagined partnership with Recover Athletics",
    tags: ["#ACADEMIC", "#PRODUCT DESIGN", "#HEALTH"],
    slug: "strava-recover",
  },
  {
    name: "Lost in Translation",
    client: "SVA MFA Thesis",
    year: "2025",
    about: "Rethinking expressions of care across distances — exploring intergenerational and intercultural communication within Asian immigrant families",
    tags: ["#THESIS", "#RESEARCH", "#SERVICE DESIGN"],
    slug: "lost-in-translation",
  },
];

const N              = PROJECTS.length;
const TWO_PI         = Math.PI * 2;
const RADIUS_X_START = 320;
const RADIUS_X_END   = 700;
const RADIUS_Y_START = 180;
const RADIUS_Y_END   = 360;
const ACTIVE_ANGLE   = Math.PI;
const WIDTH_MIN      = 100;
const WIDTH_RANGE    = 320;
const ASPECT         = 0.667;
const META_THRESH    = 0.92;
const META_W         = 280;
const INTRO_W        = 180;
const INTRO_H        = INTRO_W * ASPECT;
const INTRO_BLUR     = 4;
const INTRO_OPACITY  = 0.5;
const INTRO_END      = 0.20;

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
        fontSize: mono ? 11 : 17, fontWeight: 500,
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

function NavArrow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "1px solid #E5E5E5",
        width: 28, height: 28,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 13, color: "#B5B5B5",
        transition: "color 0.15s, border-color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#3A3A3A";
        e.currentTarget.style.borderColor = "#B5B5B5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#B5B5B5";
        e.currentTarget.style.borderColor = "#E5E5E5";
      }}
    >
      {children}
    </button>
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
  // render fn stored in a ref so the intro-animation effect can call it
  const renderRef     = useRef<((p: number, extraOffset?: number) => void) | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [metaHovered, setMetaHovered] = useState(false);
  const [cursorPos, setCursorPos]     = useState({ x: -999, y: -999 });
  const [introVisible, setIntroVisible] = useState(false);

  const router = useRouter();

  const handleStickyMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  // ── Main orbit render + ScrollTrigger ──────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    const stickyEl = sticky;

    function render(scrollProg: number, extraOffset = 0) {
      const w  = stickyEl.offsetWidth;
      const h  = stickyEl.offsetHeight;
      const cy = h * 0.50;

      const orbitRp = (scrollProg + extraOffset) * 1.25;
      const introT  = Math.min(scrollProg / INTRO_END, 1);
      const ease    = introT * introT * (3 - 2 * introT);
      const isIntro = scrollProg < INTRO_END;

      const cx = w * (0.50 + 0.60 * ease);
      const rx = RADIUS_X_START + (RADIUS_X_END - RADIUS_X_START) * ease;
      const ry = RADIUS_Y_START + (RADIUS_Y_END - RADIUS_Y_START) * ease;

      // Intro text fades out as user starts scrolling
      const textEl = introTextRef.current;
      if (textEl && scrollProg > 0) {
        textEl.style.opacity = String(Math.max(0, 1 - scrollProg / 0.10));
      }

      let bestP = -1, bestI = 0;
      let bestX = 0, bestY = 0, bestW = 0, bestH = 0;

      for (let i = 0; i < N; i++) {
        const ang       = (i / N) * TWO_PI + orbitRp * TWO_PI;
        const x         = cx + Math.cos(ang) * rx;
        const y         = cy + Math.sin(ang) * ry;
        const proximity = (Math.cos(ang - ACTIVE_ANGLE) + 1) / 2;

        const orbitW    = WIDTH_MIN + proximity * WIDTH_RANGE;
        const orbitH    = orbitW * ASPECT;
        const orbitBlur = (1 - proximity) * 8;
        const orbitOp   = 0.35 + proximity * 0.65;

        const width  = isIntro ? INTRO_W + (orbitW - INTRO_W) * ease : orbitW;
        const height = isIntro ? INTRO_H + (orbitH - INTRO_H) * ease : orbitH;
        const blur   = isIntro ? INTRO_BLUR + (orbitBlur - INTRO_BLUR) * ease : orbitBlur;
        const op     = isIntro ? INTRO_OPACITY + (orbitOp - INTRO_OPACITY) * ease : orbitOp;

        const el = frameRefs.current[i];
        if (el) {
          gsap.set(el, {
            x: x - width / 2,
            y: y - height / 2,
            width, height,
            filter: `blur(${blur}px)`,
            opacity: op,
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
        // Metadata only shows post-intro when scroll is driving (no extraOffset)
        const mo = !isIntro && extraOffset === 0 && bestP > META_THRESH
          ? (bestP - META_THRESH) / (1 - META_THRESH)
          : 0;
        gsap.set(metaEl, {
          opacity: mo,
          x: Math.max(0, bestX - bestW / 2 - META_W - 16),
          y: bestY - bestH / 2,
          pointerEvents: mo > 0 ? "auto" : "none",
        });
      }
    }

    renderRef.current = render;
    render(0);

    const st = ScrollTrigger.create({
      trigger: outer,
      start:   "top top",
      end:     "bottom bottom",
      scrub:   1,
      onUpdate: (self: ScrollTrigger) => {
        scrollProgRef.current = self.progress;
        render(self.progress, 0);
      },
    });

    const onResize = () => render(scrollProgRef.current);
    window.addEventListener("resize", onResize);

    return () => {
      renderRef.current = null;
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Intro: page fade-in then one slow orbit rotation ──────────────────────
  useEffect(() => {
    // Fade in the whole viewport shortly after mount
    const fadeTimer = setTimeout(() => setIntroVisible(true), 80);

    const AUTO_DUR = 2600; // one full orbit rotation duration (ms)
    let autoStart: number | null = null;
    let rafId: number;

    const autoTick = (now: number) => {
      if (!autoStart) autoStart = now;
      const raw = Math.min((now - autoStart) / AUTO_DUR, 1);
      // Ease in-out for a smooth, organic feel
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      renderRef.current?.(0, eased);
      if (raw < 1) {
        rafId = requestAnimationFrame(autoTick);
      } else {
        // Full orbit done — reset offset to 0 (same visual position, period = 1)
        renderRef.current?.(0, 0);
      }
    };

    // Start auto-rotation after fade begins
    const autoTimer = setTimeout(() => {
      rafId = requestAnimationFrame(autoTick);
    }, 320);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(autoTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Project step scrolling for ↑/↓ arrows ────────────────────────────────
  const scrollByProject = useCallback((dir: 1 | -1) => {
    const totalPx = document.documentElement.scrollHeight - window.innerHeight;
    const stepPx  = totalPx / (N * 1.25);
    window.scrollBy({ top: dir * stepPx, behavior: "smooth" });
  }, []);

  const proj = PROJECTS[activeIndex];

  return (
    <div ref={outerRef} style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        onMouseMove={handleStickyMouseMove}
        style={{
          position: "sticky", top: 0, height: "100vh", overflow: "hidden",
          opacity: introVisible ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      >
        {/* Carousel frames */}
        {PROJECTS.map((_, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { frameRefs.current[i] = el; }}
            style={{
              position: "absolute", left: 0, top: 0,
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
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            textAlign: "center",
            pointerEvents: "none",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 22, fontWeight: 500,
            letterSpacing: "-0.05em", lineHeight: 1.4,
            color: "#3A3A3A",
            opacity: 1,
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
          onClick={() => router.push(`/projects/${proj.slug}`)}
          onMouseEnter={() => setMetaHovered(true)}
          onMouseLeave={() => setMetaHovered(false)}
          style={{
            position: "absolute", left: 0, top: 0,
            width: META_W, minWidth: META_W,
            opacity: 0, pointerEvents: "none",
            zIndex: 20, cursor: "none",
          }}
        >
          <div key={activeIndex} style={{ animation: "metaFadeIn 0.3s ease" }}>
            <MetaRow label="Project" value={proj.name} />
            <MetaRow label="Client"  value={proj.client} />
            <MetaRow label="Year"    value={proj.year} />
            <MetaRow label="About"   value={proj.about} />
            <MetaRow label="Tags"    value={proj.tags.join("  ")} mono />
          </div>

          {/* Up / down project navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", gap: 6, marginTop: 14,
              justifyContent: "flex-end",
            }}
          >
            <NavArrow onClick={(e) => { e.stopPropagation(); scrollByProject(-1); }}>
              ↑
            </NavArrow>
            <NavArrow onClick={(e) => { e.stopPropagation(); scrollByProject(1); }}>
              ↓
            </NavArrow>
          </div>
        </div>

        {/* Custom "View Case Study" cursor pill */}
        <div
          style={{
            position: "fixed",
            left: cursorPos.x, top: cursorPos.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 50,
            opacity: metaHovered ? 1 : 0,
            transition: "opacity 0.15s",
            backgroundColor: "#1a1a1a", color: "#ffffff",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11, letterSpacing: "-0.02em",
            padding: "9px 20px", borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          View Case Study ↗
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
