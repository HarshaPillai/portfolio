"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type CaseStudyProject = {
  _id: string;
  title: string;
  slug: { current: string };
  nda?: boolean;
  ndaTitle?: string;
  projectCategory?: string;
  headline?: string;
  tagline?: string;
  solutionLabel?: string;
  processLabel?: string;
  researchLabel?: string;
  year?: string;
  duration?: string;
  role?: string;
  team?: string[];
  skills?: string[];
  hook?: string;
  context?: string;
  challenge?: string;
  decisions?: Array<{ _key?: string; decisionTitle: string; decisionBody: string }>;
  outcome?: string;
  features?: Array<{
    _key?: string;
    number?: string;
    featureTitle?: string;
    featureDescription?: string;
    mediaType?: string;
    imageUrl?: string;
    videoUrl?: string;
  }>;
  showResearch?: boolean;
  researchSummary?: string;
  researchInsights?: Array<{ _key?: string; label?: string; insight: string }>;
  researchImages?: Array<{ _key?: string; imageUrl?: string; caption?: string }>;
  showProcess?: boolean;
  showNextSteps?: boolean;
  nextSteps?: string;
  showLearnings?: boolean;
  learnings?: string;
  learningImages?: Array<{ _key?: string; imageUrl?: string; caption?: string }>;
  thumbnail?: { asset: { _ref: string } };
};

// ─── Shared style constants ───────────────────────────────────────────────────

const bodyText = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize:   15,
  color:      "#3A3A3A",
  lineHeight: 1.8,
  maxWidth:   680,
  margin:     0,
} as const;

const chapterLabel = {
  fontFamily:    "var(--font-dm-mono), monospace",
  fontSize:      10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color:         "#F35900",
  marginBottom:  12,
  display:       "block",
};

const metaLabel = {
  fontFamily:    "var(--font-dm-mono), monospace",
  fontSize:      10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color:         "rgba(58,58,58,0.4)",
  marginBottom:  6,
  display:       "block",
};

const metaValue = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize:   14,
  fontWeight: 500,
  color:      "#3A3A3A",
  lineHeight: 1.5,
  margin:     0,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyTemplate({ project }: { project: CaseStudyProject }) {
  const [activeId, setActiveId] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);

  const displayTitle = project.nda && project.ndaTitle ? project.ndaTitle : project.title;

  const chapters = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "overview", label: "Overview" }];
    if (project.hook)                                  list.push({ id: "problem",  label: "Problem" });
    if (project.features && project.features.length)   list.push({ id: "solution", label: project.solutionLabel || "Solution" });
    if (project.showResearch)                          list.push({ id: "research", label: project.researchLabel  || "Research" });
    if (project.showProcess)                           list.push({ id: "process",  label: project.processLabel   || "Process"  });
    if (project.outcome)                               list.push({ id: "outcome",  label: "Outcome"    });
    if (project.showNextSteps)                         list.push({ id: "next",     label: "Next Steps" });
    if (project.showLearnings)                         list.push({ id: "learned",  label: "What I Learned" });
    return list;
  }, [
    project.hook, project.features, project.showResearch, project.showProcess,
    project.outcome, project.showNextSteps, project.showLearnings,
    project.solutionLabel, project.researchLabel, project.processLabel,
  ]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ratioMap = new Map<string, number>();
    const observers = chapters.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratioMap.set(id, entry.intersectionRatio);
          let bestId = "", bestRatio = -1;
          ratioMap.forEach((r, sid) => { if (r > bestRatio) { bestRatio = r; bestId = sid; } });
          if (bestId) setActiveId(bestId);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [chapters]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "#FFFFFF", overflowY: "auto" }}>

      {/* ── Mobile top nav ─────────────────────────────────────────────────── */}
      {isMobile && (
        <div className="cs-mobile-nav" style={{
          position:        "fixed",
          top:             0,
          left:            0,
          right:           0,
          height:          44,
          backgroundColor: "#FFFFFF",
          borderBottom:    "1px solid rgba(0,0,0,0.08)",
          display:         "flex",
          alignItems:      "center",
          overflowX:       "auto",
          zIndex:          60,
          scrollbarWidth:  "none",
        }}>
          {chapters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                flexShrink:  0,
                padding:     "0 16px",
                height:      "100%",
                background:  "none",
                border:      "none",
                cursor:      "pointer",
                fontFamily:  "var(--font-dm-mono), monospace",
                fontSize:    9,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace:  "nowrap",
                color:       activeId === id ? "#F35900" : "rgba(58,58,58,0.5)",
                transition:  "color 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div style={{ display: "flex" }}>

        {/* LEFT COLUMN */}
        {!isMobile && (
          <div style={{
            width:           200,
            flexShrink:      0,
            position:        "sticky",
            top:             0,
            height:          "100vh",
            display:         "flex",
            flexDirection:   "column",
            gap:             32,
            padding:         "40px 24px",
            borderRight:     "1px solid rgba(0,0,0,0.06)",
          }}>
            {/* Back link */}
            <Link
              href="/projects"
              style={{
                fontFamily:     "var(--font-dm-mono), monospace",
                fontSize:       11,
                color:          "rgba(58,58,58,0.5)",
                textDecoration: "none",
                display:        "inline-block",
                transition:     "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F35900")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(58,58,58,0.5)")}
            >
              ← Projects
            </Link>

            {/* Chapter dot nav */}
            <nav>
              <div style={{ position: "relative", paddingLeft: 16 }}>
                {/* Connecting line */}
                {chapters.length > 1 && (
                  <div style={{
                    position:        "absolute",
                    left:            2,
                    top:             4,
                    bottom:          4,
                    width:           1,
                    backgroundColor: "rgba(0,0,0,0.08)",
                    pointerEvents:   "none",
                  }} />
                )}

                {chapters.map(({ id, label }, i) => (
                  <div
                    key={id}
                    onClick={() => scrollTo(id)}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          10,
                      cursor:       "pointer",
                      marginBottom: i < chapters.length - 1 ? 20 : 0,
                      position:     "relative",
                    }}
                  >
                    <div style={{
                      width:           6,
                      height:          6,
                      borderRadius:    "50%",
                      backgroundColor: activeId === id ? "#F35900" : "transparent",
                      border:          activeId === id ? "none" : "1.5px solid rgba(0,0,0,0.15)",
                      flexShrink:      0,
                      zIndex:          1,
                    }} />
                    <span style={{
                      fontFamily:    "var(--font-dm-mono), monospace",
                      fontSize:      9,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color:         activeId === id ? "#F35900" : "rgba(58,58,58,0.5)",
                      whiteSpace:    "nowrap",
                      transition:    "color 0.15s",
                      lineHeight:    1,
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* RIGHT CONTENT */}
        <div style={{
          flex:    1,
          maxWidth: 800,
          padding: isMobile ? "60px 24px 80px" : "60px 48px 120px",
        }}>

          {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
          <div id="overview" style={{ marginBottom: 72 }}>

            <p style={{
              fontFamily:    "var(--font-dm-mono), monospace",
              fontSize:      11,
              color:         "rgba(58,58,58,0.5)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              margin:        "0 0 24px",
            }}>
              {displayTitle}{project.projectCategory ? ` / ${project.projectCategory}` : ""}
            </p>

            {project.headline && (
              <h1 style={{
                fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                fontSize:      isMobile ? "clamp(28px,7vw,40px)" : "clamp(32px,5vw,52px)",
                fontWeight:    600,
                letterSpacing: "-0.03em",
                color:         "#1a1a1a",
                lineHeight:    1.1,
                margin:        "0 0 16px",
              }}>
                {project.headline}
              </h1>
            )}

            {project.tagline && (
              <p style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize:   17,
                fontWeight: 400,
                color:      "rgba(58,58,58,0.7)",
                lineHeight: 1.6,
                maxWidth:   600,
                margin:     "0 0 48px",
              }}>
                {project.tagline}
              </p>
            )}

            {/* Metadata 2×2 */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap:                 "24px 40px",
            }}>
              <div>
                <span style={metaLabel}>Role</span>
                <p style={metaValue}>{project.role || "—"}</p>
              </div>
              <div>
                <span style={metaLabel}>Timeline</span>
                <p style={metaValue}>{project.duration || "—"}</p>
              </div>
              <div>
                <span style={metaLabel}>Team</span>
                <p style={metaValue}>
                  {project.team && project.team.length > 0 ? project.team.join(", ") : "Solo"}
                </p>
              </div>
              <div>
                <span style={metaLabel}>Skills</span>
                {project.skills && project.skills.length > 0 ? (
                  <div>
                    {project.skills.map((skill) => (
                      <span key={skill} style={{
                        background:   "rgba(0,0,0,0.05)",
                        borderRadius: 99,
                        padding:      "3px 10px",
                        fontSize:     11,
                        fontFamily:   "var(--font-dm-mono), monospace",
                        display:      "inline-block",
                        margin:       "2px 4px 2px 0",
                        color:        "#3A3A3A",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={metaValue}>—</p>
                )}
              </div>
            </div>

            <div style={{
              height:          1,
              backgroundColor: "rgba(0,0,0,0.08)",
              margin:          "48px 0 64px",
            }} />
          </div>

          {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
          {project.hook && (
            <div id="problem" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>Problem</span>
              <p style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize:   18,
                fontStyle:  "italic",
                color:      "#1a1a1a",
                lineHeight: 1.8,
                maxWidth:   680,
                margin:     0,
              }}>
                {project.hook}
              </p>
            </div>
          )}

          {/* ── SOLUTION ─────────────────────────────────────────────────────── */}
          {project.features && project.features.length > 0 && (
            <div id="solution" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>{project.solutionLabel || "Solution"}</span>

              {project.features.map((f, i) => (
                <div key={f._key || i} style={{ marginBottom: 64 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    {f.number && (
                      <span style={{
                        fontFamily:   "var(--font-dm-mono), monospace",
                        fontSize:     11,
                        color:        "#F35900",
                        background:   "rgba(243,89,0,0.08)",
                        borderRadius: 99,
                        padding:      "2px 8px",
                        marginRight:  10,
                        display:      "inline-block",
                        flexShrink:   0,
                      }}>
                        {f.number}
                      </span>
                    )}
                    {f.featureTitle && (
                      <span style={{
                        fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                        fontSize:      20,
                        fontWeight:    600,
                        letterSpacing: "-0.02em",
                        color:         "#1a1a1a",
                      }}>
                        {f.featureTitle}
                      </span>
                    )}
                  </div>

                  {f.featureDescription && (
                    <p style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize:   13,
                      color:      "rgba(58,58,58,0.6)",
                      lineHeight: 1.6,
                      margin:     "0 0 24px",
                    }}>
                      {f.featureDescription}
                    </p>
                  )}

                  {f.mediaType === "image" && f.imageUrl && (
                    <Image
                      src={f.imageUrl}
                      alt={f.featureTitle || "Feature image"}
                      width={800}
                      height={500}
                      style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  )}

                  {f.mediaType === "video" && f.videoUrl && (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={f.videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── RESEARCH ─────────────────────────────────────────────────────── */}
          {project.showResearch && (
            <div id="research" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>{project.researchLabel || "Research"}</span>

              {project.researchSummary && (
                <p style={{ ...bodyText, marginBottom: 32 }}>{project.researchSummary}</p>
              )}

              {project.researchInsights && project.researchInsights.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  {project.researchInsights.map((item, i) => (
                    <div key={item._key || i} style={{
                      background:   "rgba(243,89,0,0.04)",
                      border:       "1px solid rgba(243,89,0,0.12)",
                      borderRadius: 8,
                      padding:      "16px 20px",
                      marginBottom: 12,
                    }}>
                      {item.label && (
                        <span style={{
                          fontFamily:    "var(--font-dm-mono), monospace",
                          fontSize:      9,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color:         "#F35900",
                          display:       "block",
                          marginBottom:  6,
                        }}>
                          {item.label}
                        </span>
                      )}
                      <p style={{
                        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                        fontSize:   14,
                        fontWeight: 500,
                        color:      "#1a1a1a",
                        margin:     0,
                        lineHeight: 1.6,
                      }}>
                        {item.insight}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {project.researchImages && project.researchImages.length > 0 && (
                <div style={{
                  display:             "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap:                 16,
                }}>
                  {project.researchImages.map((img, i) => img.imageUrl && (
                    <figure key={img._key || i} style={{ margin: 0 }}>
                      <Image
                        src={img.imageUrl}
                        alt={img.caption || "Research image"}
                        width={400}
                        height={300}
                        style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      {img.caption && (
                        <figcaption style={{
                          fontFamily: "var(--font-dm-mono), monospace",
                          fontSize:   11,
                          color:      "rgba(58,58,58,0.5)",
                          marginTop:  8,
                        }}>
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROCESS ──────────────────────────────────────────────────────── */}
          {project.showProcess && (
            <div id="process" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>{project.processLabel || "Process"}</span>

              {project.context && (
                <p style={{ ...bodyText, marginBottom: 32 }}>{project.context}</p>
              )}

              {project.challenge && (
                <p style={{ ...bodyText, marginBottom: 40 }}>{project.challenge}</p>
              )}

              {project.decisions && project.decisions.length > 0 && (
                <div>
                  {project.decisions.map((d, i) => (
                    <div key={d._key || i} style={{
                      borderLeft:   "2px solid rgba(243,89,0,0.2)",
                      paddingLeft:  20,
                      marginBottom: 40,
                    }}>
                      <h3 style={{
                        fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                        fontSize:      17,
                        fontWeight:    600,
                        letterSpacing: "-0.02em",
                        color:         "#1a1a1a",
                        margin:        "0 0 10px",
                      }}>
                        {d.decisionTitle}
                      </h3>
                      <p style={bodyText}>{d.decisionBody}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── OUTCOME ──────────────────────────────────────────────────────── */}
          {project.outcome && (
            <div id="outcome" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>Outcome</span>
              <p style={bodyText}>{project.outcome}</p>
            </div>
          )}

          {/* ── NEXT STEPS ───────────────────────────────────────────────────── */}
          {project.showNextSteps && (
            <div id="next" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>Next Steps</span>
              {project.nextSteps && <p style={bodyText}>{project.nextSteps}</p>}
            </div>
          )}

          {/* ── LEARNINGS ────────────────────────────────────────────────────── */}
          {project.showLearnings && (
            <div id="learned" style={{ marginBottom: 72 }}>
              <span style={chapterLabel}>What I Learned</span>

              {project.learnings && (
                <p style={{
                  ...bodyText,
                  marginBottom: project.learningImages?.length ? 32 : 0,
                }}>
                  {project.learnings}
                </p>
              )}

              {project.learningImages && project.learningImages.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 24 }}>
                  {project.learningImages.map((img, i) => img.imageUrl && (
                    <figure key={img._key || i} style={{ margin: 0 }}>
                      <Image
                        src={img.imageUrl}
                        alt={img.caption || "Reflection image"}
                        width={800}
                        height={500}
                        style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                      {img.caption && (
                        <figcaption style={{
                          fontFamily: "var(--font-dm-mono), monospace",
                          fontSize:   11,
                          color:      "rgba(58,58,58,0.5)",
                          marginTop:  8,
                        }}>
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BOTTOM NAV ───────────────────────────────────────────────────── */}
          <Link
            href="/projects"
            className="cs-back-link"
            style={{
              fontFamily:     "var(--font-dm-mono), monospace",
              fontSize:       12,
              color:          "rgba(58,58,58,0.5)",
              textDecoration: "none",
              marginTop:      80,
              display:        "inline-block",
              transition:     "color 0.15s",
            }}
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
