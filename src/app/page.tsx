import ProjectCard from "@/components/ProjectCard";
import { featuredProjects } from "@/lib/projects";

// Fixed scatter positions for the 3 featured cards on the canvas
const cardPositions = [
  { top: "10%", left: "4%" },
  { top: "6%", left: "37%" },
  { top: "42%", left: "20%" },
];

export default function Home() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Subtle canvas grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Heading — top-right */}
      <div className="absolute top-8 right-10 text-right z-10 hidden md:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Selected work
        </p>
        <p className="font-mono text-[10px] text-ink-faint mt-0.5">
          v1.0 · {new Date().getFullYear()}
        </p>
      </div>

      {/* Featured project cards — desktop scattered layout */}
      <div className="hidden md:block">
        {featuredProjects.slice(0, 3).map((project, i) => (
          <div
            key={project.slug}
            className="absolute"
            style={cardPositions[i]}
          >
            <ProjectCard project={project} />
          </div>
        ))}

        {/* Handwritten caption beneath the first card */}
        <div
          className="absolute"
          style={{ top: "calc(10% + 198px)", left: "calc(4% + 6px)" }}
        >
          <span className="caption-handwritten text-ink-muted opacity-60">
            ← start here
          </span>
        </div>

        {/* Corner annotation — bottom left */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
            {featuredProjects.length} featured
          </p>
          <a
            href="/work"
            className="font-mono text-[10px] text-rust hover:underline uppercase tracking-widest transition-colors"
          >
            View all →
          </a>
        </div>
      </div>

      {/* Mobile: stacked list */}
      <div className="md:hidden flex flex-col gap-6 p-4 pt-6">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={{ ...project, rotation: 0 }}
          />
        ))}
        <a
          href="/work"
          className="font-mono text-[10px] text-rust uppercase tracking-widest"
        >
          View all work →
        </a>
      </div>
    </div>
  );
}
