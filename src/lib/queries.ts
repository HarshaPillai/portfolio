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
