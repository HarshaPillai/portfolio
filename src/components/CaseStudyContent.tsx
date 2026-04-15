"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
import PasswordGate from "./PasswordGate";

type Props = { project: Project };

export default function CaseStudyContent({ project }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  if (project.nda && !unlocked) {
    return <PasswordGate slug={project.slug.current} onUnlock={() => setUnlocked(true)} />;
  }

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: "14px",
    letterSpacing: "-0.09em",
    color: "rgba(58,58,58,0.5)",
  };

  const label = mono;

  return (
    <article style={{ padding: "48px 48px 128px", maxWidth: "1000px" }}>
      {/* Back */}
      <a
        href="/"
        style={{ ...mono, textDecoration: "none", display: "inline-block", marginBottom: "48px" }}
      >
        ← Work
      </a>

      {/* Header */}
      <header style={{ marginBottom: "48px", maxWidth: "640px" }}>
        <dl style={{ display: "flex", flexWrap: "wrap", gap: "0 32px", marginBottom: "24px" }}>
          {project.year && (
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <dt style={label}>Year</dt>
              <dd style={{ ...mono, color: "#3A3A3A" }}>{project.year}</dd>
            </div>
          )}
          {project.duration && (
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <dt style={label}>Duration</dt>
              <dd style={{ ...mono, color: "#3A3A3A" }}>{project.duration}</dd>
            </div>
          )}
          {project.role && (
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <dt style={label}>Role</dt>
              <dd style={{ ...mono, color: "#3A3A3A" }}>{project.role}</dd>
            </div>
          )}
          {project.type && (
            <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <dt style={label}>Type</dt>
              <dd style={{ ...mono, color: "#3A3A3A" }}>{project.type}</dd>
            </div>
          )}
        </dl>

        <h1
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 500,
            letterSpacing: "-0.05em",
            color: "#3A3A3A",
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          {project.title}
        </h1>

        {project.hook && (
          <p
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "-0.05em",
              color: "#B5B5B5",
              lineHeight: 1.6,
            }}
          >
            {project.hook}
          </p>
        )}
      </header>

      {/* Hero thumbnail */}
      {project.thumbnail && (
        <div className="w-full mb-20" style={{ aspectRatio: "16/9", position: "relative" }}>
          <Image
            src={urlFor(project.thumbnail).width(1400).height(787).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      )}

      {/* Body sections */}
      <div className="max-w-2xl mx-auto space-y-16">
        {project.context && (
          <Section label="Context" body={project.context} />
        )}

        {project.challenge && (
          <Section label="Challenge" body={project.challenge} />
        )}

        {/* Decisions */}
        {project.decisions && project.decisions.length > 0 && (
          <section>
            <SectionLabel>Design Decisions</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "20px" }}>
              {project.decisions.map((d) => (
                <div key={d._key}>
                  <h3
                    style={{
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      fontSize: "17px",
                      fontWeight: 500,
                      letterSpacing: "-0.05em",
                      color: "#3A3A3A",
                      marginBottom: "8px",
                    }}
                  >
                    {d.decisionTitle}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      letterSpacing: "-0.05em",
                      color: "#B5B5B5",
                      lineHeight: 1.75,
                    }}
                  >
                    {d.decisionBody}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.outcome && (
          <Section label="Outcome" body={project.outcome} />
        )}
      </div>

      {/* Screens */}
      {project.screens && project.screens.length > 0 && (
        <section className="mt-20">
          <SectionLabel>Screens</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {project.screens.map((screen) => (
              <div key={screen._key} className="relative w-full bg-[rgba(10,10,10,0.04)]"
                style={{ aspectRatio: "4/3" }}>
                <Image
                  src={urlFor(screen).width(900).height(675).url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process Images */}
      {project.processImages && project.processImages.length > 0 && (
        <section className="mt-20">
          <SectionLabel>Process</SectionLabel>
          <div className="space-y-8 mt-6">
            {project.processImages.map((item) => (
              <figure key={item._key}>
                <div className="relative w-full bg-[rgba(10,10,10,0.04)]"
                  style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={urlFor(item.image).width(1200).height(675).url()}
                    alt={item.caption ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
                {item.caption && (
                  <figcaption className="font-mono text-[11px] text-muted mt-2">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Diagrams */}
      {project.diagrams && project.diagrams.length > 0 && (
        <section className="mt-20">
          <SectionLabel>Diagrams</SectionLabel>
          <div className="space-y-12 mt-6">
            {project.diagrams.map((d) => (
              <figure key={d._key}>
                <p className="font-mono text-[11px] text-muted tracking-wider uppercase mb-3">
                  {d.diagramTitle}
                </p>
                <div className="relative w-full bg-[rgba(10,10,10,0.04)]"
                  style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={urlFor(d.diagramImage).width(1200).height(675).url()}
                    alt={d.diagramTitle}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: "14px",
        letterSpacing: "-0.09em",
        color: "rgba(58,58,58,0.5)",
        marginBottom: "4px",
      }}
    >
      {children}
    </p>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ height: "1px", background: "#E5E5E5", margin: "12px 0 16px" }} />
      <p
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "-0.05em",
          color: "#3A3A3A",
          lineHeight: 1.8,
        }}
      >
        {body}
      </p>
    </section>
  );
}
