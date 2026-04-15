export default function AboutPage() {
  return (
    <main className="px-8 md:px-12 pt-16 min-h-[calc(100vh-var(--nav-height))] flex items-start">
      <div className="max-w-xl w-full">
        {/* Label */}
        <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-10">
          About
        </p>

        {/* Bio */}
        <div className="space-y-5 mb-14">
          <p className="font-sans text-[15px] text-foreground leading-[1.8]">
            I&apos;ve always been drawn to puzzles. The kind where there&apos;s
            no obvious right answer — just a mess of constraints, people, and
            competing needs.
          </p>
          <p className="font-sans text-[15px] text-foreground leading-[1.8]">
            Somewhere along the way those puzzles stopped being hypothetical and
            became real products, real users, real businesses. Turns out I like
            them even more with stakes.
          </p>
          <p className="font-sans text-[15px] text-foreground leading-[1.8]">
            I design SaaS products end-to-end — from blank canvas to shipped
            code. I build with AI to compress the distance between an idea and
            something you can interact with.
          </p>
        </div>

        {/* Currently / Looking for */}
        <div
          className="grid grid-cols-2 gap-10 pt-8 mb-14"
          style={{ borderTop: "1px solid rgba(10,10,10,0.08)" }}
        >
          <div>
            <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-3">
              Currently
            </p>
            <p className="font-sans text-[13px] text-foreground leading-relaxed">
              Placeholder — add your current role or focus here.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-3">
              Looking for
            </p>
            <p className="font-sans text-[13px] text-foreground leading-relaxed">
              Founding design roles at early-stage SaaS companies.
              <br />
              Available July 2025.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-8">
          <a
            href="mailto:harsha@harshapillai.com"
            className="font-mono text-[11px] tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-widest uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href="https://read.cv/harshapillai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-widest uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            Read.cv
          </a>
        </div>
      </div>
    </main>
  );
}
