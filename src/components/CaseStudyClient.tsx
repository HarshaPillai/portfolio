"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";
import PasswordGate from "@/components/PasswordGate";

type Props = {
  project: Project;
};

export default function CaseStudyClient({ project }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  if (project.nda && !unlocked) {
    return (
      <PasswordGate slug={project.slug} onUnlock={() => setUnlocked(true)} />
    );
  }

  return (
    <article className="p-8 md:p-12 max-w-3xl mx-auto">
      {/* Back */}
      <a
        href="/work"
        className="font-mono text-[10px] text-ink-muted uppercase tracking-widest hover:text-ink transition-colors mb-8 inline-block"
      >
        ← Work
      </a>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
          {project.year}
        </span>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        {project.nda && (
          <span className="font-mono text-[9px] text-rust uppercase tracking-wider">
            NDA
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink leading-tight mb-6">
        {project.title}
      </h1>

      {/* Divider */}
      <div className="h-px bg-kraft-dark/60 mb-8" />

      {/* Placeholder content */}
      <div className="space-y-6">
        <p className="font-sans text-base text-ink-muted leading-relaxed">
          {project.excerpt}
        </p>

        <div className="paper-card rounded-sm p-6 relative">
          <div className="tape" />
          <div className="relative z-10">
            <p className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-2">
              Placeholder
            </p>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              Real case study content goes here — problem framing, process,
              decisions, outcomes. This page scrolls, so let the content
              breathe.
            </p>
          </div>
        </div>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink mb-3">
            The problem
          </h2>
          <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
            Placeholder — describe the challenge, constraints, and who was
            affected.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink mb-3">
            The approach
          </h2>
          <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
            Placeholder — process, decisions, trade-offs.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink mb-3">
            Outcomes
          </h2>
          <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
            Placeholder — impact, metrics, what you learned.
          </p>
        </section>
      </div>
    </article>
  );
}
