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

const RY = 180;
const ARROW_SIZE = 44;
// Scroll pixels per radian
const SCROLL_SCALE = 0.003;
// progress reaches 1 after 3 full rotations (6π radians)
const PROGRESS_MAX_ANGLE = Math.PI * 6;
// Frame base size (progress=0) and target sizes (progress=1)
const BASE_W = 160;
const TARGET_ACTIVE_W = 580;
const TARGET_OPP_W = 200;
// Fixed active frame height at full size, used for stable arrow positioning
const ACTIVE_H_REF = TARGET_ACTIVE_W * (9 / 16);

function getFrameProps(fa: number, progress: number) {
  const TWO_PI = Math.PI * 2;
  // Angular distance from active position (Math.PI = leftmost)
  const d = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
  const nd = Math.min(d, TWO_PI - d) / Math.PI; // 0=active, 1=opposite

  const aw = BASE_W + (TARGET_ACTIVE_W - BASE_W) * progress;
  const ow = BASE_W + (TARGET_OPP_W - BASE_W) * progress * 0.3;
  const width = aw - (aw - ow) * nd;
  const height = width * (9 / 16);
  const blur = nd * 8;
  const opacity = 1 - nd * 0.6;
  const zIndex = Math.round(10 - nd * 10);
  return { width, height, blur, opacity, zIndex };
}

function getActiveIndex(ga: number): number {
  const TWO_PI = Math.PI * 2;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < 4; i++) {
    // frame 0 starts at Math.PI (leftmost) so offset by Math.PI
    const fa = ga + Math.PI + i * (Math.PI / 2);
    const d = ((fa - Math.PI) % TWO_PI + TWO_PI) % TWO_PI;
    const dist = Math.min(d, TWO_PI - d);
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

  const stickyRef = useRef<HTMLDivElement>(null);
  const gaRef = useRef(0);
  const lastActiveRef = useRef(0);

  // Resize observer on the sticky viewport div
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

  // Scroll drives globalAngle — real scrollbar, no wheel prevention
  useEffect(() => {
    const onScroll = () => {
      const ga = window.scrollY * SCROLL_SCALE;
      gaRef.current = ga;

      if (ga > 0.3) setTextGone(true);

      const active = getActiveIndex(ga);
      if (active !== lastActiveRef.current) {
        lastActiveRef.current = active;
        setActiveIndex(active);
      }

      setAngle(ga);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = Math.min(Math.abs(angle) / PROGRESS_MAX_ANGLE, 1);

  // Orbit geometry — derived from canvas dimensions and current frame size
  const cx = size.w / 2;
  const cy = size.h / 2;
  // Active frame width at current progress
  const activeFrameW = BASE_W + (TARGET_ACTIVE_W - BASE_W) * progress;
  // Active frame center lands 80px from left edge + half its own width
  const activeCX = 80 + activeFrameW / 2;
  // Orbit radius = distance from canvas center to active position
  const rx = Math.max(cx - activeCX, 50);
  const textOpacity = textGone ? 0 : Math.max(0, 1 - angle / 0.3);
  const showMeta = textGone && progress >= 0.8;
  const proj = PROJECTS[activeIndex];

  return (
    // Tall outer div creates real scroll space; 700vh ≥ 6π/SCROLL_SCALE px
    <div style={{ height: "700vh" }}>
      {/* Sticky canvas — sticks to top while page scrolls behind it */}
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* ── Carousel frames — single unified system ──────────────────────────── */}
        {size.w > 0 &&
          PROJECTS.map((_, i) => {
            // frame 0 starts at Math.PI (leftmost = active)
            const fa = angle + Math.PI + i * (Math.PI / 2);
            const rawX = cx + rx * Math.cos(fa);
            const y = cy + RY * Math.sin(fa);
            const { width, height, blur, opacity, zIndex } = getFrameProps(
              fa,
              progress
            );
            // Clamp so no frame's right edge exceeds canvas width by more than 40px
            const x = Math.min(rawX, size.w - width / 2 - 40);
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

        {/* ── Positioning text — fades out past 0.3rad, never returns ─────────── */}
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

        {/* ── Metadata panel — left of active frame, appears at progress ≥ 0.8 ── */}
        {showMeta && (
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

        {/* ── Up / down arrows — above and below active frame, appear with meta ── */}
        {showMeta && size.w > 0 && (
          <>
            <button
              onClick={() =>
                window.scrollTo({
                  top: Math.max(0, gaRef.current - Math.PI / 2) / SCROLL_SCALE,
                  behavior: "smooth",
                })
              }
              aria-label="Previous project"
              style={{
                position: "absolute",
                left: activeCX - ARROW_SIZE / 2,
                top: cy - ACTIVE_H_REF / 2 - ARROW_SIZE - 16,
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
                  top: (gaRef.current + Math.PI / 2) / SCROLL_SCALE,
                  behavior: "smooth",
                })
              }
              aria-label="Next project"
              style={{
                position: "absolute",
                left: activeCX - ARROW_SIZE / 2,
                top: cy + ACTIVE_H_REF / 2 + 16,
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
