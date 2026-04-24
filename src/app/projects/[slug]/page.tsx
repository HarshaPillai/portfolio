import { notFound }   from "next/navigation";
import { cookies }    from "next/headers";
import Image          from "next/image";
import Link           from "next/link";
import { client }     from "@/lib/sanity";
import NDAGate        from "@/components/NDAGate";
import ChapterNav     from "@/components/ChapterNav";

const query = `*[_type == "project" && slug.current == $slug][0] {
  title,
  nda,
  ndaTitle,
  "slug": slug.current,
  projectCategory,
  headline,
  tagline,
  year,
  duration,
  role,
  team,
  skills,
  hook,
  context,
  challenge,
  decisions[] {
    decisionTitle,
    decisionBody
  },
  outcome,
  features[] {
    number,
    featureTitle,
    featureDescription,
    mediaType,
    "imageUrl": image.asset->url,
    videoUrl
  },
  isLive,
  isNDA: nda
}`;

type Feature = {
  number?:             string;
  featureTitle?:       string;
  featureDescription?: string;
  mediaType?:          string;
  imageUrl?:           string;
  videoUrl?:           string;
};

type CaseStudyProject = {
  title:            string;
  nda?:             boolean;
  ndaTitle?:        string;
  slug:             string;
  projectCategory?: string;
  headline?:        string;
  tagline?:         string;
  year?:            string;
  duration?:        string;
  role?:            string;
  team?:            string[];
  skills?:          string[];
  hook?:            string;
  context?:         string;
  challenge?:       string;
  decisions?:       Array<{ decisionTitle: string; decisionBody: string }>;
  outcome?:         string;
  features?:        Feature[];
  isLive?:          boolean;
  isNDA?:           boolean;
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "project"]{ "slug": slug.current }`,
    );
    return (slugs ?? []).map((s: { slug: string }) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project: CaseStudyProject | null = null;
  try {
    project = await client.fetch<CaseStudyProject>(query, { slug });
  } catch (err) {
    console.error("[ProjectPage] Sanity fetch failed:", err);
  }

  if (!project) notFound();

  const p = project as CaseStudyProject;

  if (p.nda) {
    const cookieStore = await cookies();
    if (cookieStore.get("nda_access")?.value !== "true") {
      return <NDAGate projectTitle={p.ndaTitle || p.title} />;
    }
  }

  const displayTitle = p.nda && p.ndaTitle ? p.ndaTitle : p.title;

  const availableIds: string[] = [];
  if (p.hook)                                 availableIds.push("hook");
  if (p.context)                              availableIds.push("context");
  if (p.challenge)                            availableIds.push("challenge");
  if (p.decisions && p.decisions.length > 0) availableIds.push("decisions");
  if (p.outcome)                              availableIds.push("outcome");
  if (p.features  && p.features.length  > 0) availableIds.push("features");

  const bodyText = {
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
    fontSize:   15,
    color:      "#3A3A3A",
    lineHeight: 1.8,
    maxWidth:   680,
    margin:     0,
  } as const;

  const metaLabel = {
    fontFamily:    "var(--font-dm-mono), monospace",
    fontSize:      10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color:         "rgba(58,58,58,0.4)",
    marginBottom:  6,
    display:       "block",
  };

  const metaValue = {
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
    fontSize:   14,
    fontWeight: 500,
    color:      "#3A3A3A",
    lineHeight: 1.5,
    margin:     0,
  } as const;

  const chapterLabel = {
    fontFamily:    "var(--font-dm-mono), monospace",
    fontSize:      10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color:         "#F35900",
    marginBottom:  12,
    display:       "block",
  };

  const teamValue = Array.isArray(p.team)
    ? p.team.join(", ")
    : p.team || "Solo";

  return (
    <>
      <ChapterNav availableIds={availableIds} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 48px 120px" }}>

        {/* BREADCRUMB */}
        <p style={{
          fontFamily:    "var(--font-dm-mono), monospace",
          fontSize:      11,
          color:         "rgba(58,58,58,0.5)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          margin:        "0 0 24px",
        }}>
          {displayTitle}{p.projectCategory ? ` / ${p.projectCategory}` : ""}
        </p>

        {/* HEADLINE */}
        {p.headline && (
          <h1 style={{
            fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
            fontSize:      "clamp(32px, 5vw, 52px)",
            fontWeight:    600,
            letterSpacing: "-0.03em",
            color:         "#1a1a1a",
            lineHeight:    1.1,
            margin:        "0 0 16px",
          }}>
            {p.headline}
          </h1>
        )}

        {/* TAGLINE */}
        {p.tagline && (
          <p style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize:   17,
            fontWeight: 400,
            color:      "rgba(58,58,58,0.7)",
            lineHeight: 1.6,
            maxWidth:   600,
            margin:     "0 0 48px",
          }}>
            {p.tagline}
          </p>
        )}

        {/* METADATA GRID */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "24px 40px",
        }}>
          <div>
            <span style={metaLabel}>Role</span>
            <p style={metaValue}>{p.role || "—"}</p>
          </div>
          <div>
            <span style={metaLabel}>Timeline</span>
            <p style={metaValue}>{p.duration || "—"}</p>
          </div>
          <div>
            <span style={metaLabel}>Team</span>
            <p style={metaValue}>{teamValue}</p>
          </div>
          <div>
            <span style={metaLabel}>Skills</span>
            {p.skills && p.skills.length > 0 ? (
              <div>
                {p.skills.map((skill) => (
                  <span key={skill} style={{
                    background:   "rgba(0,0,0,0.05)",
                    borderRadius: 99,
                    padding:      "3px 10px",
                    fontSize:     11,
                    fontFamily:   "var(--font-dm-mono), monospace",
                    display:      "inline-block",
                    margin:       "2px 3px",
                    color:        "#3A3A3A",
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={metaValue}>—</p>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{
          height:          1,
          backgroundColor: "rgba(0,0,0,0.08)",
          margin:          "48px 0 64px",
        }} />

        {/* 01 — HOOK */}
        {p.hook && (
          <div id="hook" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>01 — Hook</span>
            <p style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize:   18,
              fontStyle:  "italic",
              color:      "#1a1a1a",
              lineHeight: 1.8,
              maxWidth:   680,
              margin:     0,
            }}>
              {p.hook}
            </p>
          </div>
        )}

        {/* 02 — CONTEXT */}
        {p.context && (
          <div id="context" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>02 — Context</span>
            <p style={bodyText}>{p.context}</p>
          </div>
        )}

        {/* 03 — CHALLENGE */}
        {p.challenge && (
          <div id="challenge" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>03 — Challenge</span>
            <p style={bodyText}>{p.challenge}</p>
          </div>
        )}

        {/* 04 — KEY DECISIONS */}
        {p.decisions && p.decisions.length > 0 && (
          <div id="decisions" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>04 — Key Decisions</span>
            {p.decisions.map((d, i) => (
              <div key={i} style={{
                borderLeft:   "2px solid rgba(243,89,0,0.2)",
                paddingLeft:  20,
                marginBottom: 40,
              }}>
                <h3 style={{
                  fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                  fontSize:      17,
                  fontWeight:    600,
                  letterSpacing: "-0.02em",
                  color:         "#1a1a1a",
                  margin:        "0 0 10px",
                }}>
                  {d.decisionTitle}
                </h3>
                <p style={bodyText}>{d.decisionBody}</p>
              </div>
            ))}
          </div>
        )}

        {/* 05 — OUTCOME */}
        {p.outcome && (
          <div id="outcome" style={{ marginBottom: 72 }}>
            <span style={chapterLabel}>05 — Outcome</span>
            <p style={bodyText}>{p.outcome}</p>
          </div>
        )}

        {/* 06 — FEATURES */}
        {p.features && p.features.length > 0 && (
          <div id="features" style={{ marginBottom: 72 }}>
            <span style={{ ...chapterLabel, marginBottom: 32 }}>06 — Features</span>
            {p.features.map((f, i) => (
              <div key={i} style={{ marginBottom: 64 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  {f.number && (
                    <span style={{
                      fontFamily:   "var(--font-dm-mono), monospace",
                      fontSize:     11,
                      color:        "#F35900",
                      background:   "rgba(243,89,0,0.08)",
                      borderRadius: 99,
                      padding:      "2px 8px",
                      flexShrink:   0,
                    }}>
                      {f.number}
                    </span>
                  )}
                  {f.featureTitle && (
                    <span style={{
                      fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                      fontSize:      20,
                      fontWeight:    600,
                      letterSpacing: "-0.02em",
                      color:         "#1a1a1a",
                    }}>
                      {f.featureTitle}
                    </span>
                  )}
                </div>
                {f.featureDescription && (
                  <p style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize:   13,
                    color:      "rgba(58,58,58,0.6)",
                    lineHeight: 1.6,
                    margin:     "0 0 24px",
                  }}>
                    {f.featureDescription}
                  </p>
                )}
                {f.mediaType === "image" && f.imageUrl && (
                  <Image
                    src={f.imageUrl}
                    alt={f.featureTitle || "Feature image"}
                    width={860}
                    height={540}
                    style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
                    sizes="(max-width: 768px) 100vw, 860px"
                  />
                )}
                {f.mediaType === "video" && f.videoUrl && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={f.videoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* BACK LINK */}
        <Link
          href="/projects"
          style={{
            fontFamily:     "var(--font-dm-mono), monospace",
            fontSize:       12,
            color:          "rgba(58,58,58,0.5)",
            textDecoration: "none",
            marginTop:      80,
            display:        "inline-block",
          }}
        >
          ← Back to Projects
        </Link>
      </div>
    </>
  );
}