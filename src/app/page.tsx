import { sanityClient } from "@/lib/sanity";
import { projectsQuery } from "@/lib/queries";
import type { ProjectListItem } from "@/types";
import ProjectFrame from "@/components/ProjectFrame";

// Dynamic so Sanity data is fetched at request time, not build time
export const dynamic = "force-dynamic";

export default async function Home() {
  let projects: ProjectListItem[] = [];

  try {
    projects = await sanityClient.fetch(projectsQuery);
  } catch {
    // Sanity unreachable (e.g. build env not in allowlist) — render empty shell
    projects = [];
  }

  return (
    <main className="px-8 md:px-12 pt-16 pb-32 max-w-site mx-auto">
      {/* Hero */}
      <section className="mb-24 md:mb-32 max-w-2xl">
        <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-6">
          Harsha Pillai
        </p>
        <h1 className="font-sans text-3xl md:text-4xl font-medium leading-[1.25] tracking-tight text-foreground">
          I design SaaS products that feel{" "}
          <span style={{ color: "#1B3A5C" }}>inevitable.</span>
          <br />
          I build with AI to get there faster.
        </h1>
      </section>

      {/* Project grid */}
      {projects.length === 0 ? (
        <section>
          <p className="font-mono text-[11px] text-muted tracking-wider">
            No projects yet — add them in Sanity Studio.
          </p>
        </section>
      ) : (
        <section
          className="grid gap-x-12 gap-y-0"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {projects.map((project, i) => (
            <div
              key={project._id}
              style={{
                marginTop: i % 2 === 1 ? "6rem" : "0",
                marginBottom: "7rem",
              }}
            >
              <ProjectFrame project={project} priority={i < 2} />
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
