import Link from "next/link";
import { projects } from "@/lib/projects";

function LockIcon() {
  return (
    <svg
      className="w-3 h-3 text-ink-faint"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="6" width="10" height="8" rx="1" />
      <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export default function WorkPage() {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-8 md:p-10 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="font-serif text-3xl font-bold text-ink">Work</h1>
            <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
              {projects.length} case studies
            </span>
          </div>
          <p className="font-mono text-[11px] text-ink-muted">
            Selected design work · 2022–2025
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group paper-card rounded-sm p-5 block transition-all duration-200 hover:-translate-y-0.5 hover:shadow-paper-hover"
            >
              <div className="relative z-10">
                {/* Top row: year + lock */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
                    {project.year}
                  </span>
                  {project.nda && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-ink-faint uppercase tracking-wider">
                      <LockIcon />
                      NDA
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-serif text-[16px] font-bold text-ink leading-snug mb-2 group-hover:text-rust transition-colors duration-150">
                  {project.title}
                </h2>

                {/* Excerpt */}
                <p className="font-sans text-[11px] text-ink-muted leading-relaxed mb-4 line-clamp-2">
                  {project.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
