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

  return (
    <article className="px-8 md:px-12 pt-16 pb-32 max-w-site mx-auto">
      {/* Back */}
      <a
        href="/"
        className="font-mono text-[11px] text-muted tracking-widest uppercase hover:text-foreground transition-colors duration-200 inline-block mb-16"
      >
        ← Work
      </a>

      {/* Header */}
      <header className="mb-16 max-w-2xl">
        <dl className="flex flex-wrap gap-x-8 gap-y-1 mb-6">
          {project.year && (
            <div className="flex gap-2 items-baseline">
              <dt className="font-mono text-[11px] text-muted w-14">Year</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.year}</dd>
            </div>
          )}
          {project.duration && (
            <div className="flex gap-2 items-baseline">
              <dt className="font-mono text-[11px] text-muted w-14">Duration</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.duration}</dd>
            </div>
          )}
          {project.role && (
            <div className="flex gap-2 items-baseline">
              <dt className="font-mono text-[11px] text-muted w-14">Role</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.role}</dd>
            </div>
          )}
          {project.type && (
            <div className="flex gap-2 items-baseline">
              <dt className="font-mono text-[11px] text-muted w-14">Type</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.type}</dd>
            </div>
          )}
        </dl>

        <h1 className="font-sans text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-snug mb-6">
          {project.title}
        </h1>

        {project.hook && (
          <p className="font-sans text-lg text-muted leading-relaxed">
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
            <div className="space-y-10 mt-6">
              {project.decisions.map((d) => (
                <div key={d._key}>
                  <h3 className="font-sans text-base font-medium text-foreground mb-2">
                    {d.decisionTitle}
                  </h3>
                  <p className="font-sans text-[15px] text-muted leading-relaxed">
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
    <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-1">
      {children}
    </p>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <div className="h-px w-full bg-[rgba(10,10,10,0.08)] my-4" />
      <p className="font-sans text-[15px] text-foreground leading-[1.8]">
        {body}
      </p>
    </section>
  );
}
