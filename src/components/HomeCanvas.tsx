"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
    about:
      "Reimagining career exploration for high schoolers through values-based matching",
    tags: ["#ACADEMIC", "#UX", "#RESEARCH"],
  },
];

// ─── Orbit constants ──────────────────────────────────────────────────────────
// Each thumbnail starts at one of 4 positions, 90° apart on the ellipse.
// Screen-clockwise degrees: 0°=right, 90°=bottom, 180°=left(ACTIVE), 270°=top
// Thumb 0 → active at t=0; thumb 1 → active at t=1; etc.
const START_ANGLES = [180, 90, 0, 270];
const ACTIVE_DEG = 180;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp  = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

// ─── SVG icons ────────────────────────────────────────────────────────────────
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
        fillRule="evenodd" clipRule="evenodd"
        d="M10 1.5a8.5 8.5 0 00-2.688 16.573c.425.078.58-.184.58-.41v-1.437c-2.362.513-2.861-1.138-2.861-1.138-.386-.98-.943-1.241-.943-1.241-.771-.527.058-.516.058-.516.853.06 1.302.876 1.302.876.758 1.299 1.989.924 2.474.707.077-.549.297-.924.54-1.136-1.886-.214-3.868-.943-3.868-4.196 0-.927.331-1.684.875-2.277-.088-.215-.379-1.078.083-2.246 0 0 .713-.228 2.335.87a8.12 8.12 0 012.124-.286c.72.004 1.445.097 2.124.286 1.622-1.098 2.334-.87 2.334-.87.463 1.168.172 2.031.084 2.246.545.593.874 1.35.874 2.277 0 3.261-1.985 3.98-3.876 4.19.305.263.576.78.576 1.572v2.328c0 .228.153.492.584.409A8.502 8.502 0 0010 1.5z"
        fill="#B5B5B5"
      />
    </svg>
  );
}

// ─── MetaRow ──────────────────────────────────────────────────────────────────
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingBottom: "14px",
        marginBottom: "14px",
        borderBottom: "1px solid #E5E5E5",
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        gap: "0 10px",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "12px",
          letterSpacing: "-0.09em",
          color: "rgba(58,58,58,0.5)",
          paddingTop: "4px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          color: "#3A3A3A",
          lineHeight: 1.45,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── NavArrow ─────────────────────────────────────────────────────────────────
function NavArrow({
  dir,
  btnRef,
  onClick,
  top,
  left,
}: {
  dir: "up" | "down";
  btnRef: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  top: number;
  left: number;
}) {
  return (
    <button
      ref={btnRef}
      onClick={onClick}
      aria-label={dir === "up" ? "Previous project" : "Next project"}
      className="g0"
      style={{
        position: "absolute",
        left,
        top,
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "#0A0A0A",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 22,
        transition: "opacity 0.12s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.72"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = ""; }}
    >
      {dir === "up" ? (
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeCanvas() {
  const canvasRef     = useRef<HTMLDivElement>(null);
  const frameRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const metaPanelRef  = useRef<HTMLDivElement>(null);
  const posTextRef    = useRef<HTMLDivElement>(null);
  const arrowUpRef    = useRef<HTMLButtonElement>(null);
  const arrowDownRef  = useRef<HTMLButtonElement>(null);
  const stRef         = useRef<ScrollTrigger | null>(null);
  const lastActiveRef = useRef<number>(0);

  const [activeProject, setActiveProject] = useState(0);

  // Arrow positions computed once on mount (stored in state so JSX can use them)
  const [arrows, setArrows] = useState({ cx: 0, upY: 0, downY: 0 });

  // ── Scroll to project's active midpoint ────────────────────────────────────
  const scrollToProject = useCallback((idx: number) => {
    const st = stRef.current;
    if (!st) return;
    const totalDist = st.end - st.start;
    // Each project occupies 1/4 of the scroll; jump to the centre of its active zone (0.5)
    const targetScroll = st.start + ((idx + 0.5) / 4) * totalDist;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  const handleArrowUp   = useCallback(() => scrollToProject((lastActiveRef.current - 1 + 4) % 4), [scrollToProject]);
  const handleArrowDown = useCallback(() => scrollToProject((lastActiveRef.current + 1) % 4),     [scrollToProject]);

  // ── Main GSAP effect ───────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cW = canvas.offsetWidth;
    const cH = canvas.offsetHeight;

    // Layout
    const metaW      = 300;
    const imgZoneW   = cW - metaW;
    const imgCenterX = metaW + imgZoneW / 2; // horizontal centre of image zone

    // Ellipse semi-axes
    const rx = clamp(Math.round(imgZoneW * 0.23), 140, 230);
    const ry = clamp(Math.round(cH * 0.18),        100, 160);
    // Orbit centre: positioned so the 180° point lands exactly at imgCenterX
    const orbitCX = imgCenterX + rx;
    const orbitCY = cH / 2;

    // Active frame size (16:9, constrained to image zone)
    const maxFW = Math.min(600, imgZoneW - 80);
    const maxFH = Math.min(Math.round(maxFW * (9 / 16)), Math.round(cH * 0.65));
    const frameW = Math.round(maxFH * (16 / 9));
    const frameH = maxFH;

    // Small (non-active) thumbnail size
    const thumbW = 158;
    const thumbH = 106;

    // Store arrow positions (computed here, used in JSX)
    setArrows({
      cx:    imgCenterX - 22,
      upY:   orbitCY - frameH / 2 - 60,
      downY: orbitCY + frameH / 2 + 16,
    });

    // ── Orbital update ───────────────────────────────────────────────────────
    // t: 0→4, each unit = 90° clockwise rotation = 1 project cycle (100vh)
    const updateOrbit = (t: number) => {
      const rotDeg = t * 90;

      let minDist    = 180;
      let closestIdx = 0;

      PROJECTS.forEach((_, i) => {
        const frame = frameRefs.current[i];
        if (!frame) return;

        // Current angle on the orbit (screen-clockwise degrees)
        const angle    = START_ANGLES[i] + rotDeg;
        const angleRad = (angle * Math.PI) / 180;
        const ex = orbitCX + rx * Math.cos(angleRad);
        const ey = orbitCY + ry * Math.sin(angleRad);

        // Angular distance from the active position (0–180°)
        let dist = ((angle - ACTIVE_DEG) % 360 + 360) % 360;
        if (dist > 180) dist = 360 - dist;
        if (dist < minDist) { minDist = dist; closestIdx = i; }

        const dn        = dist / 180;           // 0=active, 1=furthest
        const sizeCurve = Math.pow(dn, 0.38);  // faster decay → clear active vs. non-active

        const w    = lerp(frameW, thumbW, sizeCurve);
        const h    = lerp(frameH, thumbH, sizeCurve);
        const blur = lerp(0, 8, dn);
        const op   = lerp(1, 0.45, Math.pow(dn, 0.55));
        const z    = Math.round(lerp(10, 1, dn));

        // GSAP controls all visual properties; React never sets these via style prop
        gsap.set(frame, {
          left: ex - w / 2,
          top:  ey - h / 2,
          width: w,
          height: h,
          filter:  `blur(${blur}px)`,
          opacity: op,
          zIndex:  z,
        });
      });

      // Update React state only when the active project changes (rare → no jank)
      if (closestIdx !== lastActiveRef.current) {
        lastActiveRef.current = closestIdx;
        setActiveProject(closestIdx);
      }

      // ── UI overlay opacity ────────────────────────────────────────────────
      // Within each project cycle (frac 0→1):
      //   0.00–0.25  approaching   — thumbnails rotate in, text fades out
      //   0.25–0.40  fade-in       — metadata panel fades in
      //   0.40–0.60  locked active — full meta, arrows visible
      //   0.60–0.75  fade-out      — metadata panel fades out
      //   0.75–1.00  departing     — thumbnails rotate out, text fades back
      const frac = t % 1;
      let metaOp = 0;
      if      (frac >= 0.40 && frac <= 0.60) { metaOp = 1; }
      else if (frac > 0.25 && frac < 0.40)   { metaOp = (frac - 0.25) / 0.15; }
      else if (frac > 0.60 && frac < 0.75)   { metaOp = 1 - (frac - 0.60) / 0.15; }

      const textOp = clamp(1 - metaOp * 3, 0, 1);

      // Direct GSAP.set on refs — avoids React/GSAP style conflict
      if (metaPanelRef.current) gsap.set(metaPanelRef.current, { opacity: metaOp });
      if (posTextRef.current)   gsap.set(posTextRef.current,   { opacity: textOp });
      if (arrowUpRef.current) {
        gsap.set(arrowUpRef.current, { opacity: metaOp });
        arrowUpRef.current.style.pointerEvents = metaOp > 0.3 ? "auto" : "none";
      }
      if (arrowDownRef.current) {
        gsap.set(arrowDownRef.current, { opacity: metaOp });
        arrowDownRef.current.style.pointerEvents = metaOp > 0.3 ? "auto" : "none";
      }
    };

    // Initial state (t = 0)
    updateOrbit(0);

    // ── ScrollTrigger ─────────────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger:    canvas,
        start:      "top top",
        end:        "+=400vh",  // 4 projects × 100vh each
        pin:        true,
        pinSpacing: true,
        scrub:      true,       // animation tied exactly to scroll position
        onUpdate: (self) => updateOrbit(self.progress * 4),
      });
    });

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, []);

  const proj = PROJECTS[activeProject];

  return (
    <div
      ref={canvasRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* ── Social icons ── top right, always above everything ─────────────── */}
      <div
        style={{
          position: "absolute", top: 28, right: 32, zIndex: 30,
          display: "flex", gap: 16, alignItems: "center",
        }}
      >
        <a href="https://medium.com/@harshapillai"    target="_blank" rel="noopener noreferrer" aria-label="Medium">   <MediumIcon />   </a>
        <a href="https://linkedin.com/in/harshapillai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        <a href="https://github.com/harshapillai"      target="_blank" rel="noopener noreferrer" aria-label="GitHub">  <GitHubIcon />   </a>
      </div>

      {/* ── Positioning text ── centred in the image zone ────────────────────
          No opacity in style — GSAP controls it freely via posTextRef         */}
      <div
        ref={posTextRef}
        style={{
          position: "absolute",
          // Centre in the image zone (right of 300px metadata)
          left: "calc((100% + 300px) / 2)",
          top:  "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          maxWidth: 360,
          zIndex: 15,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 22,
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

      {/* ── Metadata panel ── left 300px, GSAP controls opacity via ref ──────
          .g0 sets initial opacity:0 without going through React style prop    */}
      <div
        ref={metaPanelRef}
        className="g0"
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
                  fontSize: 11,
                  letterSpacing: "-0.06em",
                }}
              >
                {t}
              </span>
            ))}
          </span>
        </MetaRow>
      </div>

      {/* ── Orbital frame divs ── one per project, GSAP owns all visual props  */}
      {PROJECTS.map((_, i) => (
        <div
          key={i}
          ref={(el) => { frameRefs.current[i] = el; }}
          style={{ position: "absolute", backgroundColor: "#C4C4C4" }}
        />
      ))}

      {/* ── Nav arrows ── appear during the active phase of each project ──── */}
      {arrows.cx > 0 && (
        <>
          <NavArrow
            dir="up"
            btnRef={arrowUpRef}
            onClick={handleArrowUp}
            left={arrows.cx}
            top={arrows.upY}
          />
          <NavArrow
            dir="down"
            btnRef={arrowDownRef}
            onClick={handleArrowDown}
            left={arrows.cx}
            top={arrows.downY}
          />
        </>
      )}

      {/* ── SCROLL ↑ indicator ─────────────────────────────────────────────── */}
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
