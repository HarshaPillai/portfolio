"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentBlock = {
  _key?: string;
  blockType: "text" | "gallery" | "video" | "insight" | "quote";
  heading?: string;
  body?: string;
  images?: Array<{ _key?: string; imageUrl?: string; caption?: string }>;
  videoUrl?: string;
  insightLabel?: string;
  insightItems?: string[];
  quote?: string;
  quoteAttribution?: string;
};

type FeatureImage = {
  _key?: string;
  imageUrl?: string;
  caption?: string;
};

type Feature = {
  _key?: string;
  number?: string;
  featureTitle?: string;
  featureDescription?: string;
  mediaType?: string;
  images?: FeatureImage[];
  videoUrl?: string;
};

type CaseStudyProject = {
  _id: string;
  title: string;
  slug: { current: string };
  nda?: boolean;
  ndaTitle?: string;
  projectCategory?: string;
  headline?: string;
  tagline?: string;
  overviewBody?: string;
  solutionLabel?: string;
  processLabel?: string;
  researchLabel?: string;
  ideationLabel?: string;
  year?: string;
  duration?: string;
  role?: string;
  team?: string[];
  skills?: string[];
  thumbnailUrl?: string;
  hook?: string;
  keyGaps?: string[];
  features?: Feature[];
  showResearch?: boolean;
  researchBlocks?: ContentBlock[];
  showIdeation?: boolean;
  ideationBlocks?: ContentBlock[];
  showProcess?: boolean;
  context?: string;
  challenge?: string;
  decisions?: Array<{ _key?: string; decisionTitle: string; decisionBody: string }>;
  outcome?: string;
  outcomeBlocks?: ContentBlock[];
  showNextSteps?: boolean;
  nextStepsBlocks?: ContentBlock[];
  showLearnings?: boolean;
  learningsBlocks?: ContentBlock[];
};

const toHiRes = (url: string) =>
  url.replace(/\?.*$/, "") + "?w=3200&auto=format&q=95";

// ─── ContentBlocks renderer ───────────────────────────────────────────────────

function ContentBlocks({
  blocks,
  onImageClick,
}: {
  blocks?: ContentBlock[];
  onImageClick: (src: string) => void;
}) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      {blocks.map((block, i) => {
        const key = block._key || String(i);

        if (block.blockType === "text") return (
          <div key={key}>
            {block.heading && (
              <h3 style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                color: "#1a1a1a", margin: "0 0 12px",
              }}>{block.heading}</h3>
            )}
            {block.body && (
              <p style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 15, color: "#3A3A3A", lineHeight: 1.8,
                maxWidth: 680, margin: 0,
              }}>{block.body}</p>
            )}
          </div>
        );

        if (block.blockType === "gallery") return (
          <div key={key}>
            {block.heading && (
              <h3 style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                color: "#1a1a1a", margin: "0 0 16px",
              }}>{block.heading}</h3>
            )}
            {block.images && block.images.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: block.images.length === 1 ? "1fr" : "1fr 1fr",
                gap: 12,
              }}>
                {block.images.map((img, idx) => img.imageUrl && (
                  <figure key={img._key || idx} style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.caption || ""}
                      onClick={() => onImageClick(toHiRes(img.imageUrl!))}
                      style={{ width: "100%", height: "auto", borderRadius: 8, display: "block", cursor: "zoom-in" }}
                    />
                    {img.caption && (
                      <figcaption style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: 11, color: "rgba(58,58,58,0.5)", marginTop: 6,
                      }}>{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        );

        if (block.blockType === "video") {
          const url = block.videoUrl || "";
          const isLoom = url.includes("loom.com");
          const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
          let embedUrl = url;
          if (isLoom) {
            const loomId = url.split("/").pop()?.split("?")[0];
            embedUrl = `https://www.loom.com/embed/${loomId}`;
          }
          if (isYouTube) {
            const ytId = url.includes("youtu.be")
              ? url.split("/").pop()?.split("?")[0]
              : new URL(url).searchParams.get("v");
            embedUrl = `https://www.youtube.com/embed/${ytId}`;
          }
          return (
            <div key={key}>
              {block.heading && (
                <h3 style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                  color: "#1a1a1a", margin: "0 0 16px",
                }}>{block.heading}</h3>
              )}
              {url && (
                (isLoom || isYouTube) ? (
                  <iframe
                    src={embedUrl}
                    style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, border: "none" }}
                    allowFullScreen
                  />
                ) : (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={url}
                    controls autoPlay muted loop playsInline
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )
              )}
            </div>
          );
        }

        if (block.blockType === "insight") return (
          <div key={key}>
            {block.insightLabel && (
              <p style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#F35900", margin: "0 0 12px",
              }}>{block.insightLabel}</p>
            )}
            {block.heading && (
              <h3 style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                color: "#1a1a1a", margin: "0 0 12px",
              }}>{block.heading}</h3>
            )}
            {block.body && (
              <p style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 15, color: "#3A3A3A", lineHeight: 1.8,
                maxWidth: 680, margin: "0 0 16px",
              }}>{block.body}</p>
            )}
            {block.insightItems && block.insightItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {block.insightItems.map((item, idx) => (
                  <div key={idx} style={{
                    background: "rgba(243,89,0,0.04)",
                    border: "1px solid rgba(243,89,0,0.12)",
                    borderRadius: 8, padding: "14px 18px",
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: 14, fontWeight: 500, color: "#1a1a1a",
                  }}>{item}</div>
                ))}
              </div>
            )}
          </div>
        );

        if (block.blockType === "quote") return (
          <blockquote key={key} style={{ borderLeft: "3px solid #F35900", paddingLeft: 24, margin: 0 }}>
            {block.heading && (
              <p style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#F35900", margin: "0 0 8px",
              }}>{block.heading}</p>
            )}
            {block.quote && (
              <p style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 18, fontStyle: "italic",
                color: "#1a1a1a", lineHeight: 1.6, margin: 0,
              }}>{block.quote}</p>
            )}
            {block.quoteAttribution && (
              <footer style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 11, color: "rgba(58,58,58,0.5)", marginTop: 10,
              }}>{block.quoteAttribution}</footer>
            )}
          </blockquote>
        );

        return null;
      })}
    </div>
  );
}

// ─── Video embed helper for features ─────────────────────────────────────────

function FeatureVideo({ url }: { url: string }) {
  const isLoom = url.includes("loom.com");
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  if (isLoom) {
    const id = url.split("/").pop()?.split("?")[0];
    return <iframe src={`https://www.loom.com/embed/${id}`} style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, border: "none" }} allowFullScreen />;
  }
  if (isYouTube) {
    const id = url.includes("youtu.be")
      ? url.split("/").pop()?.split("?")[0]
      : new URL(url).searchParams.get("v");
    return <iframe src={`https://www.youtube.com/embed/${id}`} style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, border: "none" }} allowFullScreen />;
  }
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video src={url} controls autoPlay muted loop playsInline style={{ width: "100%", borderRadius: 8 }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CaseStudyTemplate({ project }: { project: CaseStudyProject }) {
  const [activeChapter, setActiveChapter] = useState("overview");
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const displayTitle = project.nda && project.ndaTitle ? project.ndaTitle : project.title;

  const chapters = useMemo(() => {
    const list = [{ id: "overview", label: "Overview" }];
    if (project.hook)
      list.push({ id: "problem", label: "Problem" });
    if (project.features && project.features.length > 0)
      list.push({ id: "solution", label: project.solutionLabel || "Solution" });
    if (project.showResearch && project.researchBlocks && project.researchBlocks.length > 0)
      list.push({ id: "research", label: project.researchLabel || "Research" });
    if (project.showIdeation && project.ideationBlocks && project.ideationBlocks.length > 0)
      list.push({ id: "ideation", label: project.ideationLabel || "Ideation" });
    if (project.showProcess && (project.context || project.challenge || (project.decisions && project.decisions.length > 0)))
      list.push({ id: "process", label: project.processLabel || "Process" });
    if (project.outcome || (project.outcomeBlocks && project.outcomeBlocks.length > 0))
      list.push({ id: "outcome", label: "Outcome" });
    if (project.showNextSteps && project.nextStepsBlocks && project.nextStepsBlocks.length > 0)
      list.push({ id: "next", label: "Next Steps" });
    if (project.showLearnings && project.learningsBlocks && project.learningsBlocks.length > 0)
      list.push({ id: "learned", label: "Learnings" });
    return list;
  }, [project]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let activeId = chapters[0]?.id ?? "overview";

      for (const ch of chapters) {
        const el = document.getElementById(ch.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop < container.clientHeight * 0.3) {
          activeId = ch.id;
        }
      }
      setActiveChapter(activeId);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [chapters]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const bodyText: React.CSSProperties = {
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
    fontSize: 15, color: "#3A3A3A", lineHeight: 1.8, maxWidth: 680, margin: 0,
  };

  const chapterLabel: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#F35900",
    marginBottom: 16, display: "block",
  };

  const metaLabelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.05em", color: "rgba(58,58,58,0.4)",
    marginBottom: 6, display: "block",
  };

  const metaValueStyle: React.CSSProperties = {
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
    fontSize: 14, fontWeight: 500, color: "#3A3A3A", margin: 0,
  };

  return (
    <div ref={scrollContainerRef} style={{
      position: "fixed", inset: 0, zIndex: 50,
      backgroundColor: "#FFFFFF",
      overflowY: "auto",
      display: "flex",
    }}>

      {/* ── LEFT NAV (desktop) ──────────────────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          width: 200, flexShrink: 0,
          position: "sticky", top: 0,
          height: "100vh",
          padding: "40px 24px",
          display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          overflowY: "auto",
        }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11, color: "rgba(58,58,58,0.5)",
              textDecoration: "none", marginBottom: 32, display: "block",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F35900")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(58,58,58,0.5)")}
          >← Projects</Link>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {chapters.map(({ id, label }) => {
              const isActive = activeChapter === id;
              const isHovered = hoveredChapter === id;
              const highlighted = isActive || isHovered;
              return (
                <div
                  key={id}
                  onClick={() => scrollTo(id)}
                  onMouseEnter={() => setHoveredChapter(id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                  style={{
                    cursor: "pointer",
                    paddingLeft: highlighted ? 12 : 0,
                    paddingTop: 6,
                    paddingBottom: 6,
                    transition: "padding-left 0.15s ease",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: isActive ? 700 : 400,
                    color: highlighted ? "#F35900" : "rgba(58,58,58,0.4)",
                    transition: "color 0.15s ease",
                  }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MOBILE TOP NAV ─────────────────────────────────────────────────── */}
      {isMobile && (
        <div className="cs-mobile-nav" style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: 44, zIndex: 60,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex", alignItems: "center",
          overflowX: "auto", padding: "0 16px",
        }}>
          <Link href="/" style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10, color: "rgba(58,58,58,0.5)",
            textDecoration: "none", whiteSpace: "nowrap",
            marginRight: 20, flexShrink: 0,
          }}>← Back</Link>
          {chapters.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 9, textTransform: "uppercase",
              letterSpacing: "0.06em", whiteSpace: "nowrap",
              padding: "0 12px", flexShrink: 0,
              color: activeChapter === id ? "#F35900" : "rgba(58,58,58,0.4)",
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* ── RIGHT CONTENT ──────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        padding: isMobile ? "60px 24px 80px" : "60px 48px 120px",
        maxWidth: 860,
      }}>

        {/* OVERVIEW */}
        <div id="overview" style={{ marginBottom: 72 }}>
          <p style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11, color: "rgba(58,58,58,0.5)",
            letterSpacing: "0.05em", textTransform: "uppercase",
            margin: "0 0 24px",
          }}>
            {displayTitle}{project.projectCategory ? ` / ${project.projectCategory}` : ""}
          </p>

          {project.headline && (
            <h1 style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600,
              letterSpacing: "-0.03em", color: "#1a1a1a",
              lineHeight: 1.1, margin: "0 0 16px",
            }}>{project.headline}</h1>
          )}

          {project.tagline && (
            <p style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 17, color: "rgba(58,58,58,0.7)",
              lineHeight: 1.6, maxWidth: 600, margin: "0 0 48px",
            }}>{project.tagline}</p>
          )}

          {/* Metadata 2×2 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "24px 40px",
          }}>
            <div>
              <span style={metaLabelStyle}>Role</span>
              <p style={metaValueStyle}>{project.role || "—"}</p>
            </div>
            <div>
              <span style={metaLabelStyle}>Timeline</span>
              <p style={metaValueStyle}>{project.duration || "—"}</p>
            </div>
            <div>
              <span style={metaLabelStyle}>Team</span>
              <p style={metaValueStyle}>
                {Array.isArray(project.team) && project.team.length > 0
                  ? project.team.join(", ")
                  : "Solo"}
              </p>
            </div>
            <div>
              <span style={metaLabelStyle}>Skills</span>
              {project.skills && project.skills.length > 0 ? (
                <div>
                  {project.skills.map((s) => (
                    <span key={s} style={{
                      background: "rgba(0,0,0,0.05)", borderRadius: 99,
                      padding: "3px 10px", fontSize: 11,
                      fontFamily: "var(--font-dm-mono), monospace",
                      display: "inline-block", margin: "2px 3px", color: "#3A3A3A",
                    }}>{s}</span>
                  ))}
                </div>
              ) : (
                <p style={metaValueStyle}>—</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)", margin: "48px 0" }} />

          {/* Thumbnail */}
          {project.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              onClick={() => setLightboxSrc(toHiRes(project.thumbnailUrl!))}
              style={{ width: "100%", height: "auto", borderRadius: 8, display: "block", marginBottom: 32, cursor: "zoom-in" }}
            />
          )}

          {/* Overview body */}
          {project.overviewBody && (
            <p style={bodyText}>{project.overviewBody}</p>
          )}
        </div>

        {/* PROBLEM */}
        {project.hook && (
          <div id="problem" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>Problem</span>
            <p style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 18, fontStyle: "italic", color: "#1a1a1a",
              lineHeight: 1.8, maxWidth: 680, margin: "0 0 32px",
            }}>{project.hook}</p>

            {project.keyGaps && project.keyGaps.length > 0 && (
              <div>
                <p style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 10, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "#F35900", margin: "0 0 12px",
                }}>Key Gaps</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {project.keyGaps.map((gap, i) => (
                    <div key={i} style={{
                      background: "rgba(243,89,0,0.04)",
                      border: "1px solid rgba(243,89,0,0.12)",
                      borderRadius: 8, padding: "14px 18px",
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      fontSize: 14, fontWeight: 500, color: "#1a1a1a",
                    }}>{gap}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SOLUTION */}
        {project.features && project.features.length > 0 && (
          <div id="solution" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>{project.solutionLabel || "Solution"}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
              {project.features.map((f, i) => (
                <div key={f._key || i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {f.number && (
                      <span style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: 11, color: "#F35900",
                        background: "rgba(243,89,0,0.08)",
                        borderRadius: 99, padding: "2px 8px", flexShrink: 0,
                      }}>{f.number}</span>
                    )}
                    {f.featureTitle && (
                      <span style={{
                        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                        fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "#1a1a1a",
                      }}>{f.featureTitle}</span>
                    )}
                  </div>

                  {f.featureDescription && (
                    <p style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 13, color: "rgba(58,58,58,0.6)",
                      lineHeight: 1.6, margin: "0 0 24px",
                    }}>{f.featureDescription}</p>
                  )}

                  {f.mediaType === "gallery" && f.images && f.images.length > 0 && (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: f.images.length === 1 ? "1fr" : "1fr 1fr",
                      gap: 12,
                    }}>
                      {f.images.map((img, idx) => img.imageUrl && (
                        <figure key={img._key || idx} style={{ margin: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.imageUrl}
                            alt={img.caption || f.featureTitle || ""}
                            onClick={() => setLightboxSrc(toHiRes(img.imageUrl!))}
                            style={{ width: "100%", height: "auto", borderRadius: 8, display: "block", cursor: "zoom-in" }}
                          />
                          {img.caption && (
                            <figcaption style={{
                              fontFamily: "var(--font-dm-mono), monospace",
                              fontSize: 11, color: "rgba(58,58,58,0.5)", marginTop: 6,
                            }}>{img.caption}</figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}

                  {f.mediaType === "video" && f.videoUrl && (
                    <FeatureVideo url={f.videoUrl} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESEARCH */}
        {project.showResearch && project.researchBlocks && project.researchBlocks.length > 0 && (
          <div id="research" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>{project.researchLabel || "Research"}</span>
            <ContentBlocks blocks={project.researchBlocks} onImageClick={setLightboxSrc} />
          </div>
        )}

        {/* IDEATION */}
        {project.showIdeation && project.ideationBlocks && project.ideationBlocks.length > 0 && (
          <div id="ideation" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>{project.ideationLabel || "Ideation"}</span>
            <ContentBlocks blocks={project.ideationBlocks} onImageClick={setLightboxSrc} />
          </div>
        )}

        {/* PROCESS */}
        {project.showProcess && (project.context || project.challenge || (project.decisions && project.decisions.length > 0)) && (
          <div id="process" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>{project.processLabel || "Process"}</span>
            {project.context && <p style={{ ...bodyText, marginBottom: 32 }}>{project.context}</p>}
            {project.challenge && <p style={{ ...bodyText, marginBottom: 40 }}>{project.challenge}</p>}
            {project.decisions && project.decisions.length > 0 && (
              <div>
                {project.decisions.map((d, i) => (
                  <div key={d._key || i} style={{
                    borderLeft: "2px solid rgba(243,89,0,0.2)",
                    paddingLeft: 20, marginBottom: 40,
                  }}>
                    <h3 style={{
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em",
                      color: "#1a1a1a", margin: "0 0 10px",
                    }}>{d.decisionTitle}</h3>
                    <p style={bodyText}>{d.decisionBody}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OUTCOME */}
        {(project.outcome || (project.outcomeBlocks && project.outcomeBlocks.length > 0)) && (
          <div id="outcome" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>Outcome</span>
            {project.outcomeBlocks && project.outcomeBlocks.length > 0
              ? <ContentBlocks blocks={project.outcomeBlocks} onImageClick={setLightboxSrc} />
              : <p style={bodyText}>{project.outcome}</p>
            }
          </div>
        )}

        {/* NEXT STEPS */}
        {project.showNextSteps && project.nextStepsBlocks && project.nextStepsBlocks.length > 0 && (
          <div id="next" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>Next Steps</span>
            <ContentBlocks blocks={project.nextStepsBlocks} onImageClick={setLightboxSrc} />
          </div>
        )}

        {/* LEARNINGS */}
        {project.showLearnings && project.learningsBlocks && project.learningsBlocks.length > 0 && (
          <div id="learned" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>What I Learned</span>
            <ContentBlocks blocks={project.learningsBlocks} onImageClick={setLightboxSrc} />
          </div>
        )}

        {/* BACK LINK */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 12, color: "rgba(58,58,58,0.5)",
            textDecoration: "none", marginTop: 80, display: "inline-block",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F35900")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(58,58,58,0.5)")}
        >← Back to Projects</Link>
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────────── */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 4,
            }}
          />
          <button
            onClick={() => setLightboxSrc(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: 28,
              cursor: "pointer",
              fontFamily: "var(--font-dm-mono), monospace",
              lineHeight: 1,
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}