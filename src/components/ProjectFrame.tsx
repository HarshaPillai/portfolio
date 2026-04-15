"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProjectListItem } from "@/types";
import { urlFor } from "@/lib/sanity";

type Props = {
  project: ProjectListItem;
  priority?: boolean;
};

export default function ProjectFrame({ project, priority = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // NDA frames never unblur — skip observer
    if (project.nda) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.nda]);

  const frameClass = [
    "project-frame",
    inView ? "in-view" : "",
    project.nda ? "nda" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <div ref={ref} className={frameClass}>
      {/* Thumbnail */}
      <div className="frame-thumbnail relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
        style={{ aspectRatio: "4/3" }}>
        {project.thumbnail ? (
          <Image
            src={urlFor(project.thumbnail).width(900).height(675).url()}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          /* Placeholder when no thumbnail uploaded yet */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-muted tracking-wider">
              No image
            </span>
          </div>
        )}

        {/* NDA overlay label */}
        {project.nda && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "rgba(10,10,10,0.5)" }}
            >
              Under NDA
            </span>
          </div>
        )}
      </div>

      {/* Metadata — fades in with the frame */}
      <div className="frame-meta pt-4">
        <h2 className="font-sans text-base font-medium text-foreground mb-2 leading-snug">
          {project.title}
        </h2>

        <dl className="flex flex-col gap-0.5">
          {project.year && (
            <div className="flex items-baseline gap-2">
              <dt className="font-mono text-[11px] text-muted w-16 shrink-0">Year</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.year}</dd>
            </div>
          )}
          {project.duration && (
            <div className="flex items-baseline gap-2">
              <dt className="font-mono text-[11px] text-muted w-16 shrink-0">Duration</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.duration}</dd>
            </div>
          )}
          {project.role && (
            <div className="flex items-baseline gap-2">
              <dt className="font-mono text-[11px] text-muted w-16 shrink-0">Role</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.role}</dd>
            </div>
          )}
          {project.type && (
            <div className="flex items-baseline gap-2">
              <dt className="font-mono text-[11px] text-muted w-16 shrink-0">Type</dt>
              <dd className="font-mono text-[11px] text-foreground">{project.type}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );

  // NDA projects: link still goes to the case study (password gated there)
  return (
    <Link
      href={`/work/${project.slug.current}`}
      className="block group"
      aria-label={`View ${project.title}${project.nda ? " (NDA protected)" : ""}`}
    >
      {inner}
    </Link>
  );
}
