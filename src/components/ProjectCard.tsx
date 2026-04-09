import Link from "next/link";
import { Project } from "@/lib/projects";

type Props = {
  project: Project;
  style?: React.CSSProperties;
};

export default function ProjectCard({ project, style }: Props) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block paper-card rounded-sm p-5 w-[260px] transition-all duration-200 hover:-translate-y-1 hover:shadow-paper-hover"
      style={{
        transform: `rotate(${project.rotation ?? 0}deg)`,
        ...style,
      }}
    >
      {/* Binder clip decoration */}
      <div className="binder-clip" />

      {/* Content sits above ::before noise overlay */}
      <div className="relative z-10">
        {/* Lock badge */}
        {project.nda && (
          <div className="absolute top-0 right-0 flex items-center gap-1 bg-ink/5 rounded px-1.5 py-0.5">
            <svg
              className="w-2.5 h-2.5 text-ink-muted"
              viewBox="0 0 12 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="1" y="6" width="10" height="8" rx="1" />
              <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
              NDA
            </span>
          </div>
        )}

        {/* Year */}
        <p className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-3">
          {project.year}
        </p>

        {/* Title */}
        <h3 className="font-serif text-[17px] font-bold leading-snug text-ink mb-3 group-hover:text-rust transition-colors duration-150">
          {project.title}
        </h3>

        {/* Excerpt */}
        <p className="font-sans text-[12px] text-ink-muted leading-relaxed mb-4 line-clamp-2">
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
  );
}
