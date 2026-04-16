"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

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

// ─── Slot / scatter config type ───────────────────────────────────────────────
type SlotConfig = {
  left: number;
  top: number;
  width: number;
  height: number;
  blur: number;
  opacity: number;
  zIndex: number;
};

// Initial scatter: 4 small blurred frames spread across the canvas
function computeScatter(cW: number, cH: number): SlotConfig[] {
  return [
    { left: cW * 0.27, top: cH * 0.12, width: 162, height: 122, blur: 4, opacity: 0.72, zIndex: 5 },
    { left: cW * 0.53, top: cH * 0.07, width: 140, height: 105, blur: 6, opacity: 0.65, zIndex: 4 },
    { left: cW * 0.15, top: cH * 0.40, width: 168, height: 126, blur: 4, opacity: 0.70, zIndex: 5 },
    { left: cW * 0.63, top: cH * 0.34, width: 132, height: 99,  blur: 5, opacity: 0.60, zIndex: 4 },
  ];
}

// Orbital slots: slot 0 = active (16:9, centred in image area), slots 1–3 = scattered
// Blur tied to orbital distance from active: 0 → 4 → 8 → 4 (clockwise)
function computeSlots(cW: number, cH: number): SlotConfig[] {
  const metaW = 300;
  const imgL = metaW;
  const imgW = cW - metaW;

  // Active frame: 16:9, max 420px tall, centred in image area
  const maxH = Math.min(420, Math.round(cH * 0.65));
  const maxW = imgW - 80; // 40px margin each side
  let imgH = maxH;
  let imgFrameW = Math.round(imgH * (16 / 9));
  if (imgFrameW > maxW) {
    imgFrameW = maxW;
    imgH = Math.round(imgFrameW * (9 / 16));
  }
  const imgLeft = imgL + Math.round((imgW - imgFrameW) / 2);
  const imgTop  = Math.round((cH - imgH) / 2);

  return [
    // Slot 0: active — 16:9, centred, no blur
    { left: imgLeft, top: imgTop, width: imgFrameW, height: imgH, blur: 0, opacity: 1, zIndex: 10 },
    // Slot 1: upper-left of image area — low blur (just left active)
    { left: imgL + imgW * 0.06, top: cH * 0.08, width: 155, height: 116, blur: 4, opacity: 0.90, zIndex: 6 },
    // Slot 2: upper-right — furthest, most blurred
    { left: imgL + imgW * 0.65, top: cH * 0.08, width: 125, height: 94,  blur: 8, opacity: 0.50, zIndex: 3 },
    // Slot 3: lower centre — approaching active, low blur
    { left: imgL + imgW * 0.30, top: cH * 0.73, width: 148, height: 111, blur: 4, opacity: 0.85, zIndex: 6 },
  ];
}

// ─── SVG social icons ─────────────────────────────────────────────────────────
function MediumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6.5" cy="10" r="5.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <ellipse cx="14.5" cy="10" rx="2.5" ry="5.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <line x1="19" y1="4.5" x2="19" y2="15.5" stroke="#B5B5B5" strokeWidth="1.3" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="1.5" width="17" height="17" rx="2.5" stroke="#B5B5B5" strokeWidth="1.3" />
      <rect x="5" y="8.5" width="2.2" height="6" fill="#B5B5B5" />
      <circle cx="6.1" cy="6.2" r="1.2" fill="#B5B5B5" />
      <path d="M9.5 8.5h2.1v.9c.4-.65 1.1-1.1 2-.1 1.4 0 1.9 1 1.9 2.4V14.5H13.3v-2.4c0-.7-.2-1.3-.9-1.3-.7 0-1.1.5-1.1 1.3v2.4H9.5V8.5z" fill="#B5B5B5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41v-1.437c-2.362.513-2.861-1.138-2.861-1.138-.386-.98-.943-1.241-.943-1.241-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.989.924 2.474.707.077-.549.297-.924.54-1.136-1.886-.214-3.868-.943-3.868-4.196 0-.927.331-1.684.875-2.277-.088-.215-.379-1.078.083-2.246 0 0 .713-.228 2.335.87a8.12 8.12 0 012.124-.286c.72.004 1.445.097 2.124.286 1.622-1.098 2.334-.87 2.334-.87.463 1.168.172 2.031.084 2.246.545.593.874 1.35.874 2.277 0 3.261-1.985 3.98-3.876 4.19.305.263.576.78.576 1.572v2.328c0 .228.153.492.584.409A8.502 8.502 0 0010 1.5z"
        fill="#B5B5B5"
      />
    </svg>
  );
}

// ─── NavArrowButton ───────────────────────────────────────────────────────────
function NavArrowButton({
  direction,
  style,
  onClick,
}: {
  direction: "up" | "down";
  style: React.CSSProperties;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "up" ? "Previous project" : "Next project"}
      style={{
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "#0A0A0A",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 25,
        transition: "opacity 0.15s",
        ...style,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {direction === "up" ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 11V3M3 6.5l4-4 4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 3v8M3 7.5l4 4 4-4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── MetaRow ─────────────────────────────────────────────────────────────────
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingBottom: "12px",
        marginBottom: "12px",
        borderBottom: "1px solid #E5E5E5",
        display: "grid",
        gridTemplateColumns: "52px 1fr",
        gap: "0 10px",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "11px",
          letterSpacing: "-0.06em",
          color: "rgba(58,58,58,0.45)",
          paddingTop: "3px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: "#3A3A3A",
          lineHeight: 1.45,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeCanvas() {
  const canvasRef   = useRef<HTMLDivElement>(null);
  const frameRefs   = useRef<(HTMLDivElement | null)[]>([]);
  // slotRef[slotIdx] = projectIdx
  const slotRef     = useRef<number[]>([0, 1, 2, 3]);
  const animRef     = useRef(false);
  const modeRef     = useRef<"scatter" | "orbital">("scatter");

  const [mode,         setMode]         = useState<"scatter" | "orbital">("scatter");
  const [activeProjIdx, setActiveProjIdx] = useState(0);
  // canvasSize is set once on mount (used for nav-arrow positioning in the render)
  const [canvasSize, setCanvasSize]     = useState({ w: 0, h: 0 });
  // CSS-transition-driven opacity for React-owned UI elements
  const [textOpacity, setTextOpacity]   = useState(1);
  const [metaOpacity, setMetaOpacity]   = useState(0);

  // ── Cycle project (called by nav arrow buttons) ───────────────────────────
  const cycleProject = useCallback((dir: 1 | -1) => {
    if (animRef.current || modeRef.current !== "orbital") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    animRef.current = true;

    const old  = slotRef.current;
    // dir = -1 → clockwise (prev), dir = 1 → counter-clockwise (next)
    const next = dir === -1
      ? [old[3], old[0], old[1], old[2]]
      : [old[1], old[2], old[3], old[0]];
    slotRef.current = next;
    setActiveProjIdx(next[0]);

    const s  = computeSlots(canvas.offsetWidth, canvas.offsetHeight);
    const tl = gsap.timeline({ onComplete: () => { animRef.current = false; } });
    frameRefs.current.forEach((frame, projIdx) => {
      if (!frame) return;
      const slot = s[next.indexOf(projIdx)];
      tl.to(frame, {
        left: slot.left, top: slot.top, width: slot.width, height: slot.height,
        filter: `blur(${slot.blur}px)`, opacity: slot.opacity, zIndex: slot.zIndex,
        duration: 0.65, ease: "power2.inOut",
      }, 0);
    });
  }, []); // all deps are stable refs / module-level fns

  // ── Main effect: init positions + wheel handler ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Measure canvas and store for nav-arrow positioning
    setCanvasSize({ w: canvas.offsetWidth, h: canvas.offsetHeight });

    // Set initial scatter positions via GSAP (frames have no size yet, so no flash)
    const scatter = computeScatter(canvas.offsetWidth, canvas.offsetHeight);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      const s = scatter[i];
      gsap.set(frame, {
        left: s.left, top: s.top, width: s.width, height: s.height,
        filter: `blur(${s.blur}px)`, opacity: s.opacity, zIndex: s.zIndex,
      });
    });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animRef.current) return;

      // ── Scatter → orbital on first scroll-up ─────────────────────────────
      if (modeRef.current === "scatter") {
        if (e.deltaY >= 0) return; // ignore scroll-down in scatter mode
        animRef.current  = true;
        modeRef.current  = "orbital";
        slotRef.current  = [0, 1, 2, 3];

        // React state — triggers CSS transitions on meta panel & positioning text
        setMode("orbital");
        setTextOpacity(0);
        setMetaOpacity(1);
        setActiveProjIdx(0);

        const slots = computeSlots(canvas.offsetWidth, canvas.offsetHeight);
        const tl = gsap.timeline({ onComplete: () => { animRef.current = false; } });
        frameRefs.current.forEach((frame, i) => {
          if (!frame) return;
          const slot = slots[i]; // project i starts in slot i
          tl.to(frame, {
            left: slot.left, top: slot.top, width: slot.width, height: slot.height,
            filter: `blur(${slot.blur}px)`, opacity: slot.opacity, zIndex: slot.zIndex,
            duration: 0.8, ease: "power2.inOut",
          }, 0);
        });
        return;
      }

      // ── Orbital: rotate on every wheel event ─────────────────────────────
      animRef.current = true;
      const old  = slotRef.current;
      // scroll-up → clockwise (slot3 → slot0)
      // scroll-down → counter-clockwise (slot1 → slot0)
      const next = e.deltaY < 0
        ? [old[3], old[0], old[1], old[2]]
        : [old[1], old[2], old[3], old[0]];
      slotRef.current = next;
      setActiveProjIdx(next[0]);

      const s  = computeSlots(canvas.offsetWidth, canvas.offsetHeight);
      const tl = gsap.timeline({ onComplete: () => { animRef.current = false; } });
      frameRefs.current.forEach((frame, projIdx) => {
        if (!frame) return;
        const slot = s[next.indexOf(projIdx)];
        tl.to(frame, {
          left: slot.left, top: slot.top, width: slot.width, height: slot.height,
          filter: `blur(${slot.blur}px)`, opacity: slot.opacity, zIndex: slot.zIndex,
          duration: 0.65, ease: "power2.inOut",
        }, 0);
      });
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  const proj = PROJECTS[activeProjIdx];

  // Compute slot 0 position for nav-arrow placement (render-time, using stored canvasSize)
  const slot0 = mode === "orbital" && canvasSize.w > 0
    ? computeSlots(canvasSize.w, canvasSize.h)[0]
    : null;

  return (
    <div
      ref={canvasRef}
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Social icons — always on top right ─────────────────────────────── */}
      <div
        style={{
          position: "absolute", top: 28, right: 32, zIndex: 30,
          display: "flex", gap: 16, alignItems: "center",
        }}
      >
        <a href="https://medium.com/@harshapillai"   target="_blank" rel="noopener noreferrer" aria-label="Medium">   <MediumIcon />   </a>
        <a href="https://linkedin.com/in/harshapillai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        <a href="https://github.com/harshapillai"     target="_blank" rel="noopener noreferrer" aria-label="GitHub">  <GitHubIcon />   </a>
      </div>

      {/* ── Positioning text — visible in scatter, fades out on first scroll ─ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          maxWidth: "360px",
          zIndex: 15,
          pointerEvents: "none",
          opacity: textOpacity,
          transition: "opacity 0.35s ease",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "22px",
            fontWeight: 500,
            letterSpacing: "-0.05em",
            color: "#3A3A3A",
            lineHeight: 1.5,
          }}
        >
          Harsha is an{" "}
          <span style={{ color: "#F35900" }}>end-to-end designer.</span>
          <br />
          She thinks in systems, designs for
          <br />
          people, and ships with AI.
        </p>
      </div>

      {/* ── Metadata panel — fades in after first scroll-up ─────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0, top: 0,
          width: 300, height: "100%",
          zIndex: 20,
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E5E5",
          padding: "64px 24px 48px",
          boxSizing: "border-box",
          overflow: "hidden",
          opacity: metaOpacity,
          transition: "opacity 0.45s ease 0.25s",
          pointerEvents: mode === "orbital" ? "auto" : "none",
        }}
      >
        <MetaRow label="Project">
          {proj.name}{" "}
          <span style={{ color: "#F35900", marginLeft: 2 }}>↗</span>
        </MetaRow>
        <MetaRow label="Client">{proj.client}</MetaRow>
        <MetaRow label="Year">{proj.year}</MetaRow>
        <MetaRow label="About">{proj.about}</MetaRow>
        <MetaRow label="Tags">
          <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
            {proj.tags.map((t) => (
              <span
                key={t}
                style={{
                  color: "#B5B5B5",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "-0.06em",
                }}
              >
                {t}
              </span>
            ))}
          </span>
        </MetaRow>
      </div>

      {/* ── Frame divs — one per project, GSAP controls all visual properties ─ */}
      {/* Note: no opacity/size in React style → GSAP can freely animate them  */}
      {PROJECTS.map((_, i) => (
        <div
          key={i}
          ref={(el) => { frameRefs.current[i] = el; }}
          style={{ position: "absolute", backgroundColor: "#C4C4C4" }}
        />
      ))}

      {/* ── Nav arrows — appear once in orbital mode, cycle projects ─────────── */}
      {slot0 && (
        <>
          <NavArrowButton
            direction="up"
            onClick={() => cycleProject(-1)}
            style={{
              left: slot0.left + Math.round(slot0.width / 2) - 22,
              top:  slot0.top - 60,
            }}
          />
          <NavArrowButton
            direction="down"
            onClick={() => cycleProject(1)}
            style={{
              left: slot0.left + Math.round(slot0.width / 2) - 22,
              top:  slot0.top + slot0.height + 16,
            }}
          />
        </>
      )}

      {/* ── SCROLL ↑ — bottom right, CSS bounce ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 32, right: 32,
          zIndex: 25,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "11px",
          letterSpacing: "-0.09em",
          color: "#B5B5B5",
          animation: "scrollBounce 1.5s ease-in-out infinite",
        }}
      >
        SCROLL&nbsp;↑
      </div>
    </div>
  );
}
