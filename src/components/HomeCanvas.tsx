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

const N       = PROJECTS.length; // 7
const TWO_PI  = Math.PI * 2;
// ── Orbit geometry ────────────────────────────────────────────────────────────
const BASE_RX  = 380;  // base horizontal radius
const CX_OFFSET = 90;  // active frame sits this far right of panel centre at progress=1
const BREATHE  = 80;   // orbit radius expands by this much when active frame is at slot
const RY       = 160;  // vertical radius (fixed)
const ARROW_SIZE = 44;
// ── Dwell-phase timing ────────────────────────────────────────────────────────
// Each project cycle = ANIMATE phase (40 %) + DWELL phase (60 %)
// Raw scroll angle drives progress; display angle is locked during dwell.
const SLOT      = TWO_PI / N;      // display angle per project
const DWELL_RAW = SLOT * 1.5;      // raw angle for dwell (= SLOT × 60 %/40 %)
const CYCLE     = SLOT + DWELL_RAW; // raw angle per complete project cycle
// ── Scroll mapping ────────────────────────────────────────────────────────────
const SCROLL_SCALE = 0.004; // 700 vh @900 px ≈ 7 full cycles, plenty of dwell
const LERP         = 0.04;
// Frames reach full size at end of first cycle (animate + dwell)
const PROGRESS_MAX_ANGLE = CYCLE;
// ── Frame dimensions ──────────────────────────────────────────────────────────
const BASE_W   = 160;
const BASE_H   = 107;   // ≈ BASE_W × 2/3
const ACTIVE_W = 600;
const ACTIVE_H = 400;
const OPP_W    = 140;
const OPP_H    = 100;

// Maps raw scroll angle → display angle, pausing during dwell phases
function rawToDisplay(raw: number): number {
  const slotIndex = Math.floor(raw / CYCLE);
  const offset    = raw % CYCLE;
  return slotIndex * SLOT + Math.min(offset, SLOT); // lock at SLOT during dwell
}

// Cosine-scaled frame props; size grows with progress, shape by angular distance
function getFrameProps(fa: number, progress: number) {
  const d            = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
  const angleFromActive = Math.min(d, TWO_PI - d);
  const scale        = 0.5 + 0.5 * Math.cos(angleFromActive); // 1=active, 0=opposite
  const fullW  = OPP_W + (ACTIVE_W - OPP_W) * scale;
  const fullH  = OPP_H + (ACTIVE_H - OPP_H) * scale;
  const width  = BASE_W + (fullW - BASE_W) * progress;
  const height = BASE_H + (fullH - BASE_H) * progress;
  // Blur: global fade-out at start, position-based at full progress
  const blur    = (1 - progress) * 8 + progress * 6 * (1 - scale);
  const opacity = 0.4 + 0.6 * scale;
  const zIndex  = Math.round(1 + 9 * scale);
  return { width, height, blur, opacity, zIndex };
}

function getActiveIndex(displayAngle: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < N; i++) {
    const fa   = displayAngle + Math.PI + i * SLOT;
    const d    = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
    const dist = Math.min(d, TWO_PI - d);
    if (dist < bestDist) { bestDist = dist; best = i; }
  }
  return best;
}

function MetaRow({
  label, value, link, mono,
}: {
  label: string; value: string; link?: boolean; mono?: boolean;
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
        {link && <span style={{ color: "#F35900" }}>↗</span>}
      </span>
    </div>
  );
}

export default function HomeCanvas() {
  const [size, setSize]               = useState({ w: 0, h: 0 });
  const [angle, setAngle]             = useState(0); // lerped display angle → orbital positions
  const [rawAngle, setRawAngle]       = useState(0); // raw scroll angle → progress / size
  const [activeIndex, setActiveIndex] = useState(0);

  const stickyRef       = useRef<HTMLDivElement>(null);
  const targetDispRef   = useRef(0);  // rawToDisplay(rawAngle) — lerp target
  const displayAngleRef = useRef(0);  // lerped display angle
  const gaRef           = useRef(0);  // raw angle for arrow scroll calculations
  const lastActiveRef   = useRef(0);
  const lastLogRef      = useRef(0);

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

  // Scroll → raw angle; dwell mapping converts to display target
  useEffect(() => {
    const onScroll = () => {
      const raw = window.scrollY * SCROLL_SCALE;
      gaRef.current          = raw;
      targetDispRef.current  = rawToDisplay(raw);
      setRawAngle(raw);
      // Debug: log rotationAngle every 0.2 rad
      if (raw - lastLogRef.current > 0.2 || raw < 0.05) {
        lastLogRef.current = raw;
        console.log("[HomeCanvas] rotationAngle:", raw.toFixed(3),
          "| display:", rawToDisplay(raw).toFixed(3));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // rAF loop: lerp display angle toward dwell-mapped target
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const diff = targetDispRef.current - displayAngleRef.current;
      if (Math.abs(diff) > 0.0001) {
        displayAngleRef.current += diff * LERP;
        const ga     = displayAngleRef.current;
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

  // progress: driven by RAW scroll angle — grows during animate phases AND dwell phases
  // (frames continue to grow while display angle is locked, "zooming in" during dwell)
  const progress = Math.min(rawAngle / PROGRESS_MAX_ANGLE, 1);

  // Active frame's current angular distance from the active slot
  const activeFa            = angle + Math.PI + activeIndex * SLOT;
  const activeD             = ((activeFa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
  const activeScale         = 0.5 + 0.5 * Math.cos(Math.min(activeD, TWO_PI - activeD));

  // Breathing: orbit radius expands when active frame is at the slot (issue 4)
  const dynamicRX  = BASE_RX + BREATHE * activeScale * progress;

  // Orbit centre drifts right; formula chosen so:
  //   activeCX = cx − dynamicRX = size.w/2 − BASE_RX*(1−p) + CX_OFFSET*p
  //   → at p=1: activeCX = size.w/2 + CX_OFFSET  (issue 2 — shifted right of centre)
  const cx = size.w / 2 + (BASE_RX + CX_OFFSET + BREATHE * activeScale) * progress;
  const cy = size.h / 2;
  const activeCX = cx - dynamicRX;

  const showText    = angle < 0.3;
  const textOpacity = showText ? Math.max(0, 1 - angle / 0.3) : 0;

  // Metadata: visible only when active frame is ≥80 % of full size (issue 1)
  // effectiveSize = 1 only when progress=1 AND frame is at active slot (scale=1)
  const effectiveSize = progress * activeScale;
  const metaOpacity   = !showText && effectiveSize >= 0.8
    ? Math.min(1, (effectiveSize - 0.8) / 0.2)
    : 0;
  const showMeta = metaOpacity > 0;
  const proj     = PROJECTS[activeIndex];

  return (
    // 700 vh ensures ≥7 full project cycles at typical viewport heights
    <div style={{ height: "700vh" }}>
      {/* Sidebar (position:fixed z-50) is outside this wrapper in layout.tsx */}
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* ── Carousel frames ──────────────────────────────────────────────── */}
        {size.w > 0 &&
          PROJECTS.map((_, i) => {
            const fa = angle + Math.PI + i * SLOT;
            const x  = cx + dynamicRX * Math.cos(fa);
            const y  = cy + RY * Math.sin(fa);
            const { width, height, blur, opacity, zIndex } = getFrameProps(fa, progress);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - width / 2,
                  top: y - height / 2,
                  width, height,
                  backgroundColor: "#C4C4C4",
                  filter: `blur(${blur}px)`,
                  opacity, zIndex,
                  transition: "width 0.05s, height 0.05s", // soften size jitter
                }}
              />
            );
          })}

        {/* ── Positioning text ─────────────────────────────────────────────── */}
        {textOpacity > 0 && (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 380, textAlign: "center", pointerEvents: "none",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 22, fontWeight: 500, letterSpacing: "-0.05em",
            lineHeight: 1.4, color: "#3A3A3A",
            opacity: textOpacity, zIndex: 15,
          }}>
            Harsha is an{" "}
            <span style={{ color: "#F35900" }}>end-to-end designer</span>
            {". "}She thinks in systems, designs for people, and ships with AI.
          </div>
        )}

        {/* ── Metadata panel (left of active frame, fades with effectiveSize) ─ */}
        <div style={{
          position: "absolute", left: 0, top: "50%",
          transform: "translateY(-50%)",
          width: 220, zIndex: 20,
          opacity: metaOpacity,
          transition: "opacity 0.25s ease",
          pointerEvents: showMeta ? "auto" : "none",
        }}>
          <div key={activeIndex} style={{ animation: metaOpacity > 0 ? "metaFadeIn 0.3s ease" : "none" }}>
            <MetaRow label="Project" value={proj.name} link />
            <MetaRow label="Client"  value={proj.client} />
            <MetaRow label="Year"    value={proj.year} />
            <MetaRow label="About"   value={proj.about} />
            <MetaRow label="Tags"    value={proj.tags.join("  ")} mono />
          </div>
        </div>

        {/* ── Navigation arrows ────────────────────────────────────────────── */}
        {showMeta && size.w > 0 && (
          <>
            <button
              onClick={() => window.scrollTo({
                // jump back by one project cycle in raw scroll space
                top: Math.max(0, gaRef.current - CYCLE) / SCROLL_SCALE,
                behavior: "smooth",
              })}
              aria-label="Previous project"
              style={{
                position: "absolute",
                left: activeCX - ARROW_SIZE / 2,
                top: cy - ACTIVE_H / 2 - ARROW_SIZE - 16,
                width: ARROW_SIZE, height: ARROW_SIZE,
                borderRadius: "50%", backgroundColor: "#0A0A0A",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 30,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11V3M3 6.5l4-4 4 4"
                  stroke="white" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => window.scrollTo({
                top: (gaRef.current + CYCLE) / SCROLL_SCALE,
                behavior: "smooth",
              })}
              aria-label="Next project"
              style={{
                position: "absolute",
                left: activeCX - ARROW_SIZE / 2,
                top: cy + ACTIVE_H / 2 + 16,
                width: ARROW_SIZE, height: ARROW_SIZE,
                borderRadius: "50%", backgroundColor: "#0A0A0A",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 30,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 3v8M3 7.5l4 4 4-4"
                  stroke="white" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* ── SCROLL indicator ─────────────────────────────────────────────── */}
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
