const groq = String.raw;

export const projectsQuery = groq`
  *[_type == "project"] | order(year desc) {
    _id,
    title,
    slug,
    year,
    duration,
    role,
    type,
    nda,
    thumbnail,
    hook
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    duration,
    role,
    type,
    nda,
    hook,
    context,
    challenge,
    decisions[] {
      _key,
      decisionTitle,
      decisionBody
    },
    outcome,
    screens[] {
      _key,
      asset,
      hotspot
    },
    processImages[] {
      _key,
      image,
      caption
    },
    diagrams[] {
      _key,
      diagramTitle,
      diagramImage
    }
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project"] { "slug": slug.current }
`;

// ─── v2 queries (new schema) ──────────────────────────────────────────────────

export const getAllProjects = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, slug, tagline, year, client, tags, order
  }
`;

export const getProjectBySlug = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, tagline, year, client, tags, heroImage, order,
    hook, context, challenge, keyDecisions, outcome, selectedScreens,
    "nextProject": nextProject->{ title, slug }
  }
`;

export const getAllProjectSlugs = groq`
  *[_type == "project"] { "slug": slug.current }
`;

// ─── B-Side / lab items ───────────────────────────────────────────────────────

export const getLabItems = groq`
  *[_type == "labItem"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    year,
    about,
    type,
    externalUrl,
    contentType,
    status,
    tags,
    "thumbnail": thumbnail.asset->url
  }
`;
