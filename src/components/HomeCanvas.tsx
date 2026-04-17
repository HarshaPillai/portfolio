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

const N          = PROJECTS.length; // 7
const TWO_PI     = Math.PI * 2;
const RX         = 420;   // horizontal orbit radius
const RY         = 160;   // vertical orbit radius
const ARROW_SIZE = 44;
// At 0.0026, 500vh @ ~900px viewport ≈ 1.9 full rotations (≥1.5 required)
const SCROLL_SCALE       = 0.0026;
const LERP               = 0.04;
const PROGRESS_MAX_ANGLE = Math.PI * 2;
// Frame dimensions: BASE (progress=0), ACTIVE (at active slot, progress=1), OPP (opposite slot)
const BASE_W   = 160;
const BASE_H   = 107;   // BASE_W × 2/3
const ACTIVE_W = 600;
const ACTIVE_H = 400;   // 3:2 aspect
const OPP_W    = 140;
const OPP_H    = 100;

// Angular distance from active slot → cosine scale → dimensions/blur/opacity
function getFrameProps(fa: number, progress: number) {
  const d            = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
  const angleFromActive = Math.min(d, TWO_PI - d); // 0 = active, π = opposite

  // Cosine scale: 1.0 at active, 0.0 at opposite (per spec: scale = 0.5 + 0.5·cos)
  const scale = 0.5 + 0.5 * Math.cos(angleFromActive);

  // Full-size dimensions (cosine-scaled); grow from BASE as progress increases
  const fullW  = OPP_W + (ACTIVE_W - OPP_W) * scale;
  const fullH  = OPP_H + (ACTIVE_H - OPP_H) * scale;
  const width  = BASE_W + (fullW - BASE_W) * progress;
  const height = BASE_H + (fullH - BASE_H) * progress;

  // Blur: uniform fade-out at scroll start, position-based blur at full progress
  //   active=0px, opposite=6px (per spec: 0–6px range)
  const blur    = (1 - progress) * 8 + progress * 6 * (1 - scale);
  const opacity = 0.4 + 0.6 * scale;           // 0.4 (opposite) → 1.0 (active)
  const zIndex  = Math.round(1 + 9 * scale);   // 1 (opposite) → 10 (active)

  return { width, height, blur, opacity, zIndex };
}

function getActiveIndex(ga: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < N; i++) {
    const fa   = ga + Math.PI + i * (TWO_PI / N);
    const d    = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
    const dist = Math.min(d, TWO_PI - d);
    if (dist < bestDist) { bestDist = dist; best = i; }
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
  const [size, setSize]             = useState({ w: 0, h: 0 });
  const [angle, setAngle]           = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const stickyRef       = useRef<HTMLDivElement>(null);
  const targetAngleRef  = useRef(0);   // raw scroll → angle (for arrow nav)
  const displayAngleRef = useRef(0);   // lerped, drives renders
  const gaRef           = useRef(0);
  const lastActiveRef   = useRef(0);
  const lastLogRef      = useRef(0);   // throttle console.log

  // Resize observer
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Scroll → target angle (rAF loop does the lerp)
  useEffect(() => {
    const onScroll = () => {
      const target = window.scrollY * SCROLL_SCALE;
      targetAngleRef.current = target;
      gaRef.current = target;
      // Log every 0.2 rad to verify scrub is wired
      if (target - lastLogRef.current > 0.2 || target < 0.05) {
        lastLogRef.current = target;
        console.log("[HomeCanvas] rotationAngle:", target.toFixed(3));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // rAF lerp loop — glide displayAngle toward targetAngle
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const diff = targetAngleRef.current - displayAngleRef.current;
      if (Math.abs(diff) > 0.0001) {
        displayAngleRef.current += diff * LERP;
        const ga = displayAngleRef.current;
        const active = getActiveIndex(ga);
        if (active !== lastActiveRef.current) {
          lastActiveRef.current = active;
          setActiveIndex(active);
        }
        setAngle(ga);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // progress: 0→1 over first full rotation; angle keeps growing for cycling
  const progress = Math.min(Math.abs(angle) / PROGRESS_MAX_ANGLE, 1);

  // Orbit center drifts rightward: cx = size.w/2 at start, size.w/2 + RX at progress=1
  // → activeCX (cx − RX) travels from size.w/2 − RX to size.w/2 (panel center)
  const cx = size.w / 2 + RX * progress;
  const cy = size.h / 2;
  // Active frame center at the leftmost orbit point
  const activeCX      = cx - RX;
  // Active frame width at current progress (scale=1 at active slot)
  const activeFrameW  = BASE_W + (ACTIVE_W - BASE_W) * progress;

  const showText    = angle < 0.3;
  const textOpacity = showText ? Math.max(0, 1 - angle / 0.3) : 0;
  // Metadata visible after 0.3 progress (~1 viewport scroll) — much lower than old 0.8
  const showMeta = !showText && progress >= 0.3;
  const proj     = PROJECTS[activeIndex];

  return (
    // 500vh gives ≥1.5 rotations at typical viewport heights
    <div style={{ height: "500vh" }}>
      {/* Sticky viewport — sidebar (position:fixed z-50) is outside this wrapper */}
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* ── Carousel frames — cosine-scaled by angular distance from active ─── */}
        {size.w > 0 &&
          PROJECTS.map((_, i) => {
            // frame 0 at Math.PI (leftmost = active), evenly spaced 2π/N
            const fa = angle + Math.PI + i * (TWO_PI / N);
            const x  = cx + RX * Math.cos(fa);
            const y  = cy + RY * Math.sin(fa);
            const { width, height, blur, opacity, zIndex } = getFrameProps(fa, progress);
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

        {/* ── Positioning text — fades out on scroll, back at top ─────────────── */}
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

        {/* ── Metadata panel — left of active frame, vertically centered ───────── */}
        {showMeta && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 220,
              zIndex: 20,
              animation: "metaFadeIn 0.3s ease",
            }}
          >
            <div key={activeIndex} style={{ animation: "metaFadeIn 0.3s ease" }}>
              <MetaRow label="Project" value={proj.name} link />
              <MetaRow label="Client"  value={proj.client} />
              <MetaRow label="Year"    value={proj.year} />
              <MetaRow label="About"   value={proj.about} />
              <MetaRow label="Tags"    value={proj.tags.join("  ")} mono />
            </div>
          </div>
        )}

        {/* ── Arrows — centered above/below the active frame ───────────────────── */}
        {showMeta && size.w > 0 && (
          <>
            <button
              onClick={() =>
                window.scrollTo({
                  top: Math.max(0, gaRef.current - TWO_PI / N) / SCROLL_SCALE,
                  behavior: "smooth",
                })
              }
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
              onClick={() =>
                window.scrollTo({
                  top: (gaRef.current + TWO_PI / N) / SCROLL_SCALE,
                  behavior: "smooth",
                })
              }
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

        {/* ── SCROLL indicator ─────────────────────────────────────────────────── */}
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
    </div>
  );
}
