import { labItems, LabItem } from "@/lib/lab";

const typeLabels: Record<LabItem["type"], string> = {
  prototype: "Prototype",
  artifact: "Artifact",
  experiment: "Experiment",
  tool: "Tool",
};

const typeColors: Record<LabItem["type"], string> = {
  prototype: "text-pine",
  artifact: "text-rust",
  experiment: "text-ink-muted",
  tool: "text-ink",
};

function PinHead() {
  return (
    <div
      className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10"
      style={{
        background: "radial-gradient(circle at 35% 35%, #D4A843, #8B6914)",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    />
  );
}

function LabCard({ item }: { item: LabItem }) {
  return (
    <div
      className="paper-card rounded-sm p-4 relative group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-paper-hover"
      style={{ transform: `rotate(${item.rotation ?? 0}deg)` }}
    >
      <PinHead />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`font-mono text-[9px] uppercase tracking-widest bg-ink/5 px-1.5 py-0.5 rounded-sm ${typeColors[item.type]}`}
          >
            {typeLabels[item.type]}
          </span>
          <span className="font-mono text-[10px] text-ink-faint">
            {item.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[15px] font-bold text-ink leading-snug mb-2 group-hover:text-rust transition-colors duration-150">
          {item.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-[11px] text-ink-muted leading-relaxed mb-3 line-clamp-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map((tag) => (
            <span key={tag} className="tag text-[9px]">
              {tag}
            </span>
          ))}
        </div>

        {/* Live link */}
        {item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-rust hover:underline uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
          >
            Open ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function LabPage() {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-8 md:p-10 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="font-serif text-3xl font-bold text-ink">Lab</h1>
            <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
              {labItems.length} items
            </span>
          </div>
          <p className="font-mono text-[11px] text-ink-muted max-w-sm leading-relaxed">
            Live experiments, vibe-coded prototypes, Claude artifacts.
            <br />
            Things built to learn, not ship.
          </p>
        </div>

        {/* Pinboard grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {labItems.map((item) => (
            <LabCard key={item.id} item={item} />
          ))}
        </div>

        {/* Footer annotation */}
        <div className="mt-12 pt-6 border-t border-kraft-dark/50">
          <p className="font-mono text-[10px] text-ink-faint">
            Updated irregularly · Links go live as experiments stabilise
          </p>
        </div>
      </div>
    </div>
  );
}
