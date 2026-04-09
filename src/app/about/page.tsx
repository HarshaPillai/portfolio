export default function AboutPage() {
  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <div className="p-8 md:p-12 max-w-xl w-full">
        {/* Name / title */}
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-3">
            About
          </p>
          <h1 className="font-serif text-4xl font-bold text-ink leading-tight">
            Harsha Pillai
          </h1>
          <p className="font-mono text-[11px] text-ink-muted mt-2 tracking-wider">
            Product designer who ships code.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-kraft-dark/60 mb-8" />

        {/* Bio — puzzle framing */}
        <div className="paper-card rounded-sm p-6 mb-6 relative">
          <div className="tape" />
          <div className="relative z-10 space-y-3">
            <p className="font-sans text-[13px] text-ink leading-[1.75]">
              I&apos;ve always been drawn to puzzles. The kind where there&apos;s
              no obvious right answer — just a mess of constraints, people,
              and competing needs.
            </p>
            <p className="font-sans text-[13px] text-ink-muted leading-[1.75]">
              Somewhere along the way those puzzles stopped being hypothetical
              and became real products, real users, real businesses. Turns out
              I like them even more with stakes.
            </p>
          </div>
        </div>

        {/* Currently / Looking for */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-1.5">
              Currently
            </p>
            <p className="font-sans text-[12px] text-ink-muted leading-relaxed">
              Building at the intersection of design and engineering.
              Placeholder — update with your current role.
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-1.5">
              Looking for
            </p>
            <p className="font-sans text-[12px] text-ink-muted leading-relaxed">
              Founding design roles, small teams, hard problems.
              Available July 2025.
            </p>
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-8 pt-5 border-t border-kraft-dark/50 flex items-center gap-4">
          <a
            href="mailto:hello@harshapillai.com"
            className="font-mono text-[10px] text-rust hover:underline uppercase tracking-widest"
          >
            Email ↗
          </a>
          <a
            href="https://linkedin.com/in/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-ink-muted hover:text-ink hover:underline uppercase tracking-widest transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://read.cv/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-ink-muted hover:text-ink hover:underline uppercase tracking-widest transition-colors"
          >
            Read.cv ↗
          </a>
        </div>
      </div>
    </div>
  );
}
