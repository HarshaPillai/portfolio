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
    about:
      "End-to-end design system and IA for a residential GC operations platform",
    tags: ["#SAAS", "#AI", "#CLIENT"],
  },
  {
    name: "Stealth Invoicing Platform",
    client: "Undisclosed",
    year: "2025",
    about:
      "Contractor and client portal for construction job lifecycle management",
    tags: ["#SAAS", "#FINTECH", "#CLIENT"],
  },
  {
    name: "B2B Operations Platform",
    client: "Undisclosed",
    year: "2024",
    about:
      "Workflow automation and AI command center for real estate operations",
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

// ─── Scatter layout: [left%, top%, widthpx, heightpx] ────────────────────────
const SCATTER: [string, string, number, number][] = [
  ["29%", "13%", 160, 120],
  ["45%", "10%", 140, 105],
  ["19%", "36%", 165, 125],
  ["60%", "33%", 130, 100],
];

// Clockwise orbital exit vectors per thumbnail
const ORBITAL_EXIT = [
  // phase1 (drift):        phase2 (exit):
  { p1: { x: 80,  y: 10,  r: 20,  s: 0.75 }, p2: { x: 0,   y: 0,   s: 0, o: 0 } },
  { p1: { x: 40,  y: 80,  r: -15, s: 0.70 }, p2: { x: 200, y: 300, s: 0, o: 0 } },
  { p1: { x: 60,  y: -70, r: 25,  s: 0.70 }, p2: { x: -100,y: -300,s: 0, o: 0 } },
  { p1: { x: -50, y: 70,  r: -25, s: 0.65 }, p2: { x: -300,y: 200, s: 0, o: 0 } },
];

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

// ─── MetaRow ─────────────────────────────────────────────────────────────────
function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        paddingBottom: "12px",
        marginBottom: "12px",
        borderBottom: "1px solid #E5E5E5",
        display: "grid",
        gridTemplateColumns: "64px 1fr",
        gap: "0 16px",
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "-0.09em",
          color: "rgba(58,58,58,0.5)",
          paddingTop: "4px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "18px",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          color: "#3A3A3A",
          lineHeight: 1.4,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const scatteredLayerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posTextRef = useRef<HTMLDivElement>(null);
  const detailLayerRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);

  // Cycle project with fade
  const cycleProject = useCallback(
    (dir: 1 | -1) => {
      const next = (activeIndex + dir + PROJECTS.length) % PROJECTS.length;
      if (!panelContentRef.current) {
        setActiveIndex(next);
        return;
      }
      gsap.to(panelContentRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(next);
          gsap.to(panelContentRef.current, {
            opacity: 1,
            duration: 0.22,
            ease: "power2.out",
          });
        },
      });
    },
    [activeIndex]
  );

  // GSAP ScrollTrigger setup
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=700",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          onUpdate(self) {
            if (self.progress >= 0.88) {
              setIsDetailed(true);
            } else {
              setIsDetailed(false);
            }
          },
        },
      });

      // ── Phase 1 (0 → 0.5): all thumbs begin clockwise orbital drift ─────
      thumbRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(
          el,
          {
            x: ORBITAL_EXIT[i].p1.x,
            y: ORBITAL_EXIT[i].p1.y,
            rotation: ORBITAL_EXIT[i].p1.r,
            scale: ORBITAL_EXIT[i].p1.s,
            filter: "blur(8px)",
            ease: "none",
            duration: 0.5,
          },
          0
        );
      });

      // Positioning text exits up
      tl.to(
        posTextRef.current,
        { opacity: 0, y: -18, ease: "none", duration: 0.4 },
        0
      );

      // ── Phase 2 (0.45 → 0.85): non-active thumbs spiral off screen ──────
      [1, 2, 3].forEach((i) => {
        const el = thumbRefs.current[i];
        if (!el) return;
        tl.to(
          el,
          {
            x: ORBITAL_EXIT[i].p2.x,
            y: ORBITAL_EXIT[i].p2.y,
            scale: ORBITAL_EXIT[i].p2.s,
            opacity: ORBITAL_EXIT[i].p2.o,
            ease: "none",
            duration: 0.4,
          },
          0.45
        );
      });

      // Active thumb (0) fades as it "becomes" the panel image
      tl.to(
        thumbRefs.current[0],
        { opacity: 0, scale: 0.3, ease: "none", duration: 0.3 },
        0.5
      );

      // ── Phase 3 (0.65 → 1.0): detailed panel appears ────────────────────
      tl.fromTo(
        detailLayerRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.35 },
        0.65
      );
    }, pinRef);

    return () => ctx.revert();
  }, []);

  const project = PROJECTS[activeIndex];

  return (
    <div
      ref={pinRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* ── Social icons — always visible, top right ─────────────────────── */}
      <div
        className="absolute z-30 flex items-center gap-4"
        style={{ top: "28px", right: "32px" }}
      >
        <a href="https://medium.com/@harshapillai" target="_blank" rel="noopener noreferrer" aria-label="Medium">
          <MediumIcon />
        </a>
        <a href="https://linkedin.com/in/harshapillai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href="https://github.com/harshapillai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </a>
      </div>

      {/* ── Scattered layer ───────────────────────────────────────────────── */}
      <div ref={scatteredLayerRef} className="absolute inset-0">
        {/* Thumbnails */}
        {SCATTER.map(([left, top, w, h], i) => (
          <div
            key={i}
            ref={(el) => { thumbRefs.current[i] = el; }}
            className="absolute"
            style={{
              left,
              top,
              width: `${w}px`,
              height: `${h}px`,
              backgroundColor: "#C4C4C4",
              filter: "blur(4px)",
              opacity: 0.6,
              willChange: "transform, opacity, filter",
            }}
          />
        ))}

        {/* Positioning text */}
        <div
          ref={posTextRef}
          className="absolute"
          style={{
            left: "50%",
            top: "48%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            maxWidth: "380px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "24px",
              fontWeight: 500,
              letterSpacing: "-0.05em",
              color: "#3A3A3A",
              lineHeight: 1.45,
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

        {/* SCROLL ↓ */}
        <div
          className="absolute"
          style={{
            bottom: "32px",
            right: "32px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "11px",
            letterSpacing: "-0.09em",
            color: "#B5B5B5",
          }}
        >
          SCROLL &nbsp;↓
        </div>
      </div>

      {/* ── Detailed layer ────────────────────────────────────────────────── */}
      <div
        ref={detailLayerRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          pointerEvents: isDetailed ? "auto" : "none",
        }}
      >
        <div
          ref={panelContentRef}
          className="absolute inset-0 flex"
          style={{ paddingTop: "64px", paddingLeft: "40px", paddingRight: "40px" }}
        >
          {/* Left: metadata panel */}
          <div style={{ width: "340px", flexShrink: 0, paddingTop: "16px" }}>
            <MetaRow label="PROJECT">
              {project.name}{" "}
              <span style={{ color: "#F35900", marginLeft: "4px" }}>↗</span>
            </MetaRow>
            <MetaRow label="CLIENT">{project.client}</MetaRow>
            <MetaRow label="YEAR">{project.year}</MetaRow>
            <MetaRow label="ABOUT">{project.about}</MetaRow>
            <MetaRow label="TAGS">
              {project.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    marginRight: "12px",
                    color: "#B5B5B5",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "14px",
                    letterSpacing: "-0.09em",
                  }}
                >
                  {t}
                </span>
              ))}
            </MetaRow>
          </div>

          {/* Right: large image + nav arrows */}
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{ gap: "16px" }}
          >
            {/* Up arrow */}
            <button
              onClick={() => cycleProject(-1)}
              aria-label="Previous project"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#0A0A0A",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11.5V2.5M3 6l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Image placeholder */}
            <div
              style={{
                width: "580px",
                maxWidth: "100%",
                height: "435px",
                backgroundColor: "#C4C4C4",
              }}
            />

            {/* Down arrow */}
            <button
              onClick={() => cycleProject(1)}
              aria-label="Next project"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#0A0A0A",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5v9M3 8l4 4 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
