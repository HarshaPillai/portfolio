"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { ProjectV2 } from "@/types";
import { urlFor } from "@/lib/sanity";

// ─── Chapter config ────────────────────────────────────────────────────────────
const CHAPTERS = [
  { id: "hook",     label: "Hook" },
  { id: "context",  label: "Context" },
  { id: "challenge",label: "Challenge" },
  { id: "decisions",label: "Decisions" },
  { id: "outcome",  label: "Outcome" },
  { id: "screens",  label: "Screens" },
] as const;

// ─── Shared styles ─────────────────────────────────────────────────────────────
const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#999",
};

const sectionHeadline: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: "-0.04em",
  color: "#1a1a1a",
  lineHeight: 1.2,
  margin: "8px 0 0",
};

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.75,
  color: "#1a1a1a",
  maxWidth: 620,
  margin: "16px 0 0",
};

const sectionWrap: React.CSSProperties = {
  paddingTop: 100,
  paddingBottom: 100,
};

// ─── Fixed right chapter timeline ──────────────────────────────────────────────
const GAP = 52; // px between circle centers

function ChapterTimeline({
  activeIdx,
  onChapterClick,
}: {
  activeIdx: number;
  onChapterClick: (i: number) => void;
}) {
  const N = CHAPTERS.length;
  const completedH = Math.min(activeIdx * GAP, (N - 1) * GAP);

  return (
    <div
      style={{
        position: "fixed",
        right: 40,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Labels column */}
      <div>
        {CHAPTERS.map((ch, i) => {
          const isActive = i === activeIdx;
          const isDone = i < activeIdx;
          return (
            <div
              key={ch.id}
              style={{
                height: i < N - 1 ? GAP : undefined,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                onClick={() => onChapterClick(i)}
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive
                    ? "#E8420A"
                    : isDone
                    ? "rgba(232,66,10,0.5)"
                    : "#cccccc",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {ch.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Circles + connecting line */}
      <div style={{ position: "relative" }}>
        {/* Gray base line */}
        <div
          style={{
            position: "absolute",
            left: 3,
            top: 4,
            width: 2,
            height: (N - 1) * GAP,
            backgroundColor: "#e0e0e0",
          }}
        />
        {/* Orange completed line */}
        <div
          style={{
            position: "absolute",
            left: 3,
            top: 4,
            width: 2,
            height: completedH,
            backgroundColor: "#E8420A",
            transition: "height 0.35s ease",
          }}
        />
        {CHAPTERS.map((ch, i) => {
          const isActive = i === activeIdx;
          const isDone = i < activeIdx;
          return (
            <div
              key={ch.id}
              onClick={() => onChapterClick(i)}
              style={{
                height: i < N - 1 ? GAP : undefined,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isActive
                    ? "#E8420A"
                    : isDone
                    ? "rgba(232,66,10,0.35)"
                    : "transparent",
                  border: !isActive && !isDone ? "1.5px solid #e0e0e0" : "none",
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chapter label stamp ───────────────────────────────────────────────────────
function ChLabel({ num, name }: { num: string; name: string }) {
  return (
    <div style={monoLabel}>
      {num} — {name}
    </div>
  );
}

// ─── Main template ─────────────────────────────────────────────────────────────
export default function CaseStudyTemplate({ project }: { project: ProjectV2 }) {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // IntersectionObserver — update active chapter at 40% visibility
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (idx !== -1) setActiveChapter(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToChapter = useCallback((i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      sectionRefs.current[i] = el;
    },
    []
  );

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          left: "calc(var(--sidebar-width) + 24px)",
          top: 32,
          zIndex: 40,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 12,
          letterSpacing: "-0.04em",
          color: "#999",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#999";
        }}
      >
        ← Projects
      </button>

      {/* Fixed right timeline */}
      <ChapterTimeline
        activeIdx={activeChapter}
        onChapterClick={scrollToChapter}
      />

      {/* Content area */}
      <div style={{ padding: "80px 120px 0 24px" }}>
        <div style={{ maxWidth: 720 }}>

          {/* ── Hero section ── */}
          <div style={{ marginBottom: 80 }}>
            {project.heroImage?.asset ? (
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <Image
                  src={urlFor(project.heroImage).width(1400).url()}
                  alt={project.heroImage.alt || project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="720px"
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  backgroundColor: "#e8e8e8",
                }}
              />
            )}

            {/* Orange accent bar */}
            <div
              style={{
                width: 48,
                height: 3,
                backgroundColor: "#E8420A",
                marginTop: 32,
              }}
            />

            <h1
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: "16px 0 0",
              }}
            >
              {project.title}
            </h1>

            {project.tagline && (
              <p
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#666",
                  lineHeight: 1.5,
                  margin: "12px 0 0",
                }}
              >
                {project.tagline}
              </p>
            )}

            <div
              style={{
                height: 1,
                backgroundColor: "#f0f0f0",
                marginTop: 24,
              }}
            />
          </div>

          {/* ── Chapter 1: Hook ── */}
          <section
            ref={setRef(0)}
            data-chapter="1"
            style={sectionWrap}
          >
            <ChLabel num="01" name="HOOK" />
            <h2 style={sectionHeadline}>{project.hook?.headline}</h2>
            <p style={bodyText}>{project.hook?.body}</p>
          </section>

          {/* ── Chapter 2: Context ── */}
          <section
            ref={setRef(1)}
            data-chapter="2"
            style={{ ...sectionWrap, borderTop: "1px solid #f5f5f5" }}
          >
            <ChLabel num="02" name="CONTEXT" />
            <h2 style={sectionHeadline}>{project.context?.headline}</h2>
            <p style={bodyText}>{project.context?.body}</p>
            {(project.year || project.client) && (
              <div
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 12,
                  color: "#999",
                  letterSpacing: "-0.04em",
                  marginTop: 20,
                }}
              >
                {[project.year, project.client].filter(Boolean).join(" — ")}
              </div>
            )}
          </section>

          {/* ── Chapter 3: Challenge ── */}
          <section
            ref={setRef(2)}
            data-chapter="3"
            style={{ ...sectionWrap, borderTop: "1px solid #f5f5f5" }}
          >
            <ChLabel num="03" name="CHALLENGE" />
            <h2 style={sectionHeadline}>{project.challenge?.headline}</h2>
            <p style={bodyText}>{project.challenge?.body}</p>

            {project.challenge?.pullQuote && (
              <blockquote
                style={{
                  borderLeft: "2px solid #E8420A",
                  paddingLeft: 20,
                  margin: "32px 0",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: 19,
                    fontStyle: "italic",
                    color: "#333",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {project.challenge.pullQuote}
                </p>
                {project.challenge.pullQuoteAttribution && (
                  <footer
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 11,
                      color: "#999",
                      marginTop: 8,
                    }}
                  >
                    {project.challenge.pullQuoteAttribution}
                  </footer>
                )}
              </blockquote>
            )}
          </section>

          {/* ── Chapter 4: Key Decisions ── */}
          <section
            ref={setRef(3)}
            data-chapter="4"
            style={{ ...sectionWrap, borderTop: "1px solid #f5f5f5" }}
          >
            <ChLabel num="04" name="KEY DECISIONS" />
            <h2 style={sectionHeadline}>Key Decisions</h2>

            <div style={{ marginTop: 32 }}>
              {project.keyDecisions?.map((d, i, arr) => (
                <div key={d._key || i}>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#E8420A",
                    }}
                  >
                    {d.decisionNumber}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      color: "#1a1a1a",
                      margin: "4px 0 8px",
                    }}
                  >
                    {d.headline}
                  </h3>
                  <p style={{ ...bodyText, margin: 0 }}>{d.body}</p>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        height: 1,
                        backgroundColor: "#f0f0f0",
                        margin: "32px 0",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Chapter 5: Outcome ── */}
          <section
            ref={setRef(4)}
            data-chapter="5"
            style={{ ...sectionWrap, borderTop: "1px solid #f5f5f5" }}
          >
            <ChLabel num="05" name="OUTCOME" />
            <h2 style={sectionHeadline}>{project.outcome?.headline}</h2>
            <p style={bodyText}>{project.outcome?.body}</p>
          </section>

          {/* ── Chapter 6: Selected Screens ── */}
          <section
            ref={setRef(5)}
            data-chapter="6"
            style={{ ...sectionWrap, borderTop: "1px solid #f5f5f5" }}
          >
            <ChLabel num="06" name="SELECTED SCREENS" />
            <h2 style={sectionHeadline}>Selected Screens</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
                marginTop: 32,
              }}
            >
              {project.selectedScreens?.map((screen, i) => (
                <figure key={screen._key || i} style={{ margin: 0 }}>
                  {screen.image?.asset ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                      }}
                    >
                      <Image
                        src={urlFor(screen.image).width(1200).url()}
                        alt={screen.image.alt || screen.caption || ""}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="720px"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        backgroundColor: "#e8e8e8",
                      }}
                    />
                  )}
                  {screen.caption && (
                    <figcaption
                      style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: 11,
                        color: "#999",
                        fontStyle: "italic",
                        marginTop: 10,
                      }}
                    >
                      {screen.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>

          {/* ── Bottom nav ── */}
          <div
            style={{
              padding: "40px 0 80px",
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {project.nextProject && (
              <Link
                href={`/projects/${project.nextProject.slug.current}`}
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 13,
                  color: "#999",
                  textDecoration: "none",
                  letterSpacing: "-0.04em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#999";
                }}
              >
                Next: {project.nextProject.title} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
