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

// ─── Landing page projects ────────────────────────────────────────────────────

export const getLandingProjects = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    client,
    year,
    about,
    tags,
    "thumbnailUrl": thumbnail.asset->url,
    type,
    nda,
    ndaTitle,
    isLive,
    isExternal,
    externalUrl,
    order
  }
`;

// ─── Full case study query (block-based schema) ───────────────────────────────

export const getProjectBySlugFull = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    nda,
    ndaTitle,
    projectCategory,
    headline,
    tagline,
    overviewBody,
    solutionLabel,
    processLabel,
    researchLabel,
    ideationLabel,
    year,
    duration,
    role,
    team,
    skills,
    "thumbnailUrl": thumbnail.asset->url,
    hook,
    keyGaps,
    features[] {
      _key,
      number,
      featureTitle,
      featureDescription,
      mediaType,
      images[] {
        _key,
        "imageUrl": image.asset->url,
        caption
      },
      videoUrl
    },
    showResearch,
    researchBlocks[] {
      _key,
      blockType,
      heading,
      body,
      images[] { _key, "imageUrl": image.asset->url, caption },
      videoUrl,
      insightLabel,
      insightItems,
      quote,
      quoteAttribution
    },
    showIdeation,
    ideationBlocks[] {
      _key,
      blockType,
      heading,
      body,
      images[] { _key, "imageUrl": image.asset->url, caption },
      videoUrl,
      insightLabel,
      insightItems,
      quote,
      quoteAttribution
    },
    showProcess,
    context,
    challenge,
    decisions[] {
      _key,
      decisionTitle,
      decisionBody
    },
    outcome,
    outcomeBlocks[] {
      _key,
      blockType,
      heading,
      body,
      images[] { _key, "imageUrl": image.asset->url, caption },
      videoUrl,
      insightLabel,
      insightItems,
      quote,
      quoteAttribution
    },
    showNextSteps,
    nextStepsBlocks[] {
      _key,
      blockType,
      heading,
      body,
      images[] { _key, "imageUrl": image.asset->url, caption },
      videoUrl,
      insightLabel,
      insightItems,
      quote,
      quoteAttribution
    },
    showLearnings,
    learningsBlocks[] {
      _key,
      blockType,
      heading,
      body,
      images[] { _key, "imageUrl": image.asset->url, caption },
      videoUrl,
      insightLabel,
      insightItems,
      quote,
      quoteAttribution
    },
    isLive
  }
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
