"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LandingProject } from "@/types";
import NDAModal from "@/components/NDAModal";

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
const NDA_MIN_BLUR   = 8;

type DisplayProject = {
  name: string;
  client: string;
  year: string;
  about: string;
  tags: string[];
  slug: string;
  thumbnailUrl?: string;
  nda: boolean;
  isLive: boolean;
  isExternal: boolean;
  externalUrl?: string;
};

function sanityOptimized(url: string) {
  return url + (url.includes("?") ? "&" : "?") + "w=800&auto=format&q=80";
}

function toDisplay(p: LandingProject): DisplayProject {
  return {
    name:         p.nda && p.ndaTitle ? p.ndaTitle : p.title,
    client:       p.client  || "—",
    year:         p.year    || "—",
    about:        p.about   || "",
    tags:         p.tags    || [],
    slug:         p.slug,
    thumbnailUrl: p.thumbnailUrl ? sanityOptimized(p.thumbnailUrl) : undefined,
    nda:          !!p.nda,
    isLive:       p.isLive    !== false,
    isExternal:   p.isExternal === true,
    externalUrl:  p.externalUrl,
  };
}

function NdaFrameOverlay() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.38)" }} />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 7, pointerEvents: "none",
      }}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <rect x="1" y="9" width="14" height="10" rx="2" fill="rgba(255,255,255,0.88)" />
          <path d="M4 9V6a4 4 0 0 1 8 0v3" stroke="rgba(255,255,255,0.88)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="13.5" r="1.5" fill="rgba(0,0,0,0.3)" />
        </svg>
        <span style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 8, letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.65)", textTransform: "uppercase",
        }}>NDA</span>
      </div>
    </>
  );
}

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

// ─── Mobile project card ──────────────────────────────────────────────────────
function MobileProjectCard({
  p,
  onNdaClick,
}: {
  p: DisplayProject;
  onNdaClick: (name: string, slug: string) => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!p.isLive) return;
    if (p.nda) {
      onNdaClick(p.name, p.slug);
    } else if (p.isExternal && p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/projects/${p.slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: "100%",
        padding: "0 24px",
        opacity: p.isLive ? 1 : 0.6,
        cursor: p.isLive ? "pointer" : "default",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden" }}>
        {p.thumbnailUrl ? (
          <Image
            src={p.thumbnailUrl}
            alt={p.name}
            fill
            style={{ objectFit: "cover", filter: p.nda ? "blur(8px)" : "none" }}
            sizes="(max-width: 768px) 100vw"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#C4C4C4" }} />
        )}
        {p.nda && <NdaFrameOverlay />}
      </div>

      {/* Title + NDA badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
        <span style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 15, fontWeight: 500,
          color: "#1a1a1a",
        }}>
          {p.name}
        </span>
        {p.nda && (
          <span style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 9, letterSpacing: "0.08em",
            border: "1px solid #F35900", color: "#F35900",
            padding: "1px 6px", borderRadius: 100,
            textTransform: "uppercase", flexShrink: 0,
          }}>
            NDA
          </span>
        )}
      </div>

      {/* Client */}
      <div style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 11, color: "rgba(58,58,58,0.5)",
        marginTop: 4,
      }}>
        {p.client}
      </div>
    </div>
  );
}

export default function HomeCanvas({ projects }: { projects: LandingProject[] }) {
  const outerRef         = useRef<HTMLDivElement>(null);
  const stickyRef        = useRef<HTMLDivElement>(null);
  const frameRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const ndaOverlayRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef          = useRef<HTMLDivElement>(null);
  const introTextRef  = useRef<HTMLDivElement>(null);
  const scrollProgRef = useRef(0);
  const lastActiveI   = useRef(-1);
  const renderRef     = useRef<((p: number, extraOffset?: number) => void) | null>(null);

  const displayProjects: DisplayProject[] = useMemo(
    () => projects.map(toDisplay),
    [projects],
  );

  // Keep a ref so the GSAP closure always reads the latest data without re-subscribing
  const displayProjectsRef = useRef(displayProjects);
  displayProjectsRef.current = displayProjects;

  // NDA progressive reveal — starts at 0 (no blur/overlay), animates to 1 on first scroll
  const ndaRevealFactorRef = useRef(0);

  const [activeIndex, setActiveIndex]     = useState(0);
  const [metaHovered, setMetaHovered]     = useState(false);
  const [introVisible, setIntroVisible]   = useState(false);
  const [ndaModalProject, setNdaModalProject] = useState<{ name: string; slug: string } | null>(null);
  const [isMobile, setIsMobile]           = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const check = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
      clearTimeout(timeout);
    };
  }, []);

  const router = useRouter();

  // ── Main orbit render + ScrollTrigger ──────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const outer  = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    const stickyEl = sticky;

    function render(scrollProg: number, extraOffset = 0) {
      const n = frameRefs.current.filter(Boolean).length;
      if (n === 0) return;

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

      const textEl = introTextRef.current;
      if (textEl && scrollProg > 0) {
        textEl.style.opacity = String(Math.max(0, 1 - scrollProg / 0.10));
      }

      let bestP = -1, bestI = 0;
      let bestX = 0, bestY = 0, bestW = 0, bestH = 0;

      for (let i = 0; i < n; i++) {
        // Reversed rotation + π phase: item 0 starts at active angle (π),
        // items then appear in ascending index order as the user scrolls.
        const ang       = (i / n) * TWO_PI - orbitRp * TWO_PI + Math.PI;
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

        const isNda   = displayProjectsRef.current[i]?.nda ?? false;
        const revealF = ndaRevealFactorRef.current;
        // Blur and overlay both scale with reveal factor — 0 on load, full after first scroll
        const finalBlur = isNda ? Math.max(blur, NDA_MIN_BLUR * revealF) : blur;
        const zIdx      = Math.round(proximity * 10);

        const el = frameRefs.current[i];
        if (el) {
          gsap.set(el, {
            x: x - width / 2,
            y: y - height / 2,
            width, height,
            filter: `blur(${finalBlur}px)`,
            opacity: op,
            zIndex: zIdx,
          });
        }

        // NDA overlay: same position/size as frame, no blur, one z-layer above
        const ndaEl = ndaOverlayRefs.current[i];
        if (ndaEl && isNda) {
          gsap.set(ndaEl, {
            x: x - width / 2,
            y: y - height / 2,
            width, height,
            filter: "none",
            opacity: op * revealF,
            zIndex: zIdx + 1,
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

    const onResize = () => {
      ScrollTrigger.refresh();
      render(scrollProgRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderRef.current = null;
      st.kill();
      ScrollTrigger.refresh();
      window.removeEventListener("resize", onResize);
      // Reset all frame positions on teardown
      frameRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0 });
      });
    };
  }, [isMobile]);

  // ── Intro: fade-in then one slow orbit rotation ────────────────────────────
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIntroVisible(true), 80);

    const AUTO_DUR = 2600;
    let autoStart: number | null = null;
    let rafId: number;

    const autoTick = (now: number) => {
      if (!autoStart) autoStart = now;
      const raw = Math.min((now - autoStart) / AUTO_DUR, 1);
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      // Scale to 0.8 so orbitRp = 0.8 × 1.25 = 1.0 — exactly one full revolution.
      // When reset fires at (0, 0) the frame positions are mathematically identical,
      // so there is no visual jump.
      renderRef.current?.(0, eased * 0.8);
      if (raw < 1) {
        rafId = requestAnimationFrame(autoTick);
      } else {
        renderRef.current?.(0, 0);
      }
    };

    const autoTimer = setTimeout(() => {
      rafId = requestAnimationFrame(autoTick);
    }, 320);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(autoTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── NDA reveal: fade in blur + lock overlay on first scroll ──────────────
  useEffect(() => {
    const onFirstScroll = () => {
      const start = performance.now();
      const dur   = 700;
      const tick  = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        ndaRevealFactorRef.current = 1 - Math.pow(1 - t, 3); // ease-out cubic
        renderRef.current?.(scrollProgRef.current, 0);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, []);

  // ── Project step scrolling for ↑/↓ arrows ────────────────────────────────
  const scrollByProject = useCallback((dir: 1 | -1) => {
    const n = displayProjectsRef.current.length;
    if (n === 0) return;
    const totalPx = document.documentElement.scrollHeight - window.innerHeight;
    const stepPx  = totalPx / (n * 1.25);
    window.scrollBy({ top: dir * stepPx, behavior: "smooth" });
  }, []);

  const proj = displayProjects[Math.min(activeIndex, displayProjects.length - 1)];

  const handleProjectClick = useCallback(() => {
    const p = displayProjectsRef.current[lastActiveI.current]
      ?? displayProjectsRef.current[0];
    if (!p) return;
    if (p.nda && p.isLive) {
      setNdaModalProject({ name: p.name, slug: p.slug });
    } else if (p.isExternal && p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else if (p.isLive) {
      router.push(`/projects/${p.slug}`);
    }
  }, [router]);

  const isClickable = !!proj && (
    proj.nda ? proj.isLive : (proj.isExternal || proj.isLive)
  );
  const hoverLabel = !proj
    ? ""
    : proj.nda
      ? proj.isLive ? "Enter Password →" : "Coming Soon"
      : proj.isExternal
        ? "View Project →"
        : proj.isLive
          ? "View Case Study →"
          : "Coming Soon";

  if (isMobile) {
    const mobileProjects = [...projects]
      .sort((a, b) => {
        const ao = a.mobileOrder ?? a.order ?? 999;
        const bo = b.mobileOrder ?? b.order ?? 999;
        return ao - bo;
      })
      .map(toDisplay);

    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, paddingTop: 24, paddingBottom: 24 }}>
          {mobileProjects.map((p, i) => (
            <MobileProjectCard
              key={i}
              p={p}
              onNdaClick={(name, slug) => setNdaModalProject({ name, slug })}
            />
          ))}
        </div>
        {ndaModalProject && (
          <NDAModal
            projectName={ndaModalProject.name}
            slug={ndaModalProject.slug}
            onClose={() => setNdaModalProject(null)}
          />
        )}
      </>
    );
  }

  return (
    <div ref={outerRef} style={{ height: "500vh", contain: "layout" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky", top: 0, height: "100vh", overflow: "hidden",
          opacity: introVisible ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      >
        {/* Carousel frames — thumbnail background if available */}
        {displayProjects.map((p, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { frameRefs.current[i] = el; }}
            style={{
              position: "absolute", left: 0, top: 0,
              backgroundColor: "#C4C4C4",
              backgroundImage: p.thumbnailUrl ? `url(${p.thumbnailUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
              willChange: "transform, width, height, opacity, filter",
            }}
          />
        ))}

        {/* NDA overlays — siblings (not children) of frames so they bypass the blur filter */}
        {displayProjects.map((p, i) => p.nda ? (
          <div
            key={`nda-${i}`}
            ref={(el: HTMLDivElement | null) => { ndaOverlayRefs.current[i] = el; }}
            style={{
              position: "absolute", left: 0, top: 0,
              opacity: 0,
              willChange: "transform, width, height, opacity",
            }}
          >
            <NdaFrameOverlay />
          </div>
        ) : null)}

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
        {proj && (
          <div
            ref={metaRef}
            onClick={handleProjectClick}
            onMouseEnter={() => setMetaHovered(true)}
            onMouseLeave={() => setMetaHovered(false)}
            style={{
              position: "absolute", left: 0, top: 0,
              width: META_W, minWidth: META_W,
              opacity: 0, pointerEvents: "none",
              zIndex: 20,
              cursor: isClickable ? "pointer" : "default",
              willChange: "transform, opacity",
            }}
          >
            {/* Metadata rows — key resets animation on project change */}
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
              style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "flex-end" }}
            >
              <NavArrow onClick={(e) => { e.stopPropagation(); scrollByProject(-1); }}>↑</NavArrow>
              <NavArrow onClick={(e) => { e.stopPropagation(); scrollByProject(1); }}>↓</NavArrow>
            </div>

            {/* Centered hover label overlay */}
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: metaHovered ? 1 : 0,
                transition: "opacity 0.15s",
                pointerEvents: "none",
                backgroundColor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              <span style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 11, letterSpacing: "-0.02em",
                color: isClickable ? "#1a1a1a" : "rgba(58,58,58,0.38)",
                backgroundColor: "#FFFFFF",
                padding: "9px 20px", borderRadius: 100,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                {hoverLabel}
              </span>
            </div>
          </div>
        )}

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

      {/* NDA password modal */}
      {ndaModalProject && (
        <NDAModal
          projectName={ndaModalProject.name}
          slug={ndaModalProject.slug}
          onClose={() => setNdaModalProject(null)}
        />
      )}
    </div>
  );
}
