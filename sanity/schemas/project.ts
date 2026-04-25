// Sanity project schema
// Use this in your Sanity Studio at sanity/schemaTypes/project.ts

// ── Reusable content block type ───────────────────────────────────────────────
const contentBlock = {
  type: "object",
  name: "contentBlock",
  title: "Content Block",
  fields: [
    {
      name: "blockType",
      title: "Block Type",
      type: "string",
      options: {
        list: [
          { title: "Text (heading + body)", value: "text" },
          { title: "Image Gallery", value: "gallery" },
          { title: "Video", value: "video" },
          { title: "Insight / Key Points", value: "insight" },
          { title: "Quote", value: "quote" },
        ],
        layout: "radio",
      },
      initialValue: "text",
    },
    {
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional heading above the content.",
    },
    {
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      description: "Paragraph text.",
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType === "gallery" ||
        parent?.blockType === "video" ||
        parent?.blockType === "quote",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      description: "Upload one or more images. Multiple = gallery grid.",
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "gallery",
      of: [
        {
          type: "object",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
    },
    {
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Direct .mp4, Loom, or YouTube URL.",
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "video",
    },
    {
      name: "insightLabel",
      title: "Insight Label",
      type: "string",
      description: 'e.g. "KEY GAPS", "KEY INSIGHT", "FROM RESEARCH"',
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "insight",
    },
    {
      name: "insightItems",
      title: "Insight Items",
      type: "array",
      description: "Each item becomes a card.",
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "insight",
      of: [{ type: "string" }],
    },
    {
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "quote",
    },
    {
      name: "quoteAttribution",
      title: "Quote Attribution",
      type: "string",
      description: 'e.g. "— Software Engineer, user interview"',
      hidden: ({ parent }: { parent: { blockType?: string } }) =>
        parent?.blockType !== "quote",
    },
  ],
  preview: {
    select: {
      blockType: "blockType",
      heading: "heading",
      body: "body",
      insightLabel: "insightLabel",
    },
    prepare({ blockType, heading, body, insightLabel }: {
      blockType?: string;
      heading?: string;
      body?: string;
      insightLabel?: string;
    }) {
      const icons: Record<string, string> = {
        text: "📝", gallery: "🖼️", video: "🎥", insight: "💡", quote: "💬",
      };
      const icon = icons[blockType ?? "text"] ?? "📝";
      const title = heading || insightLabel || body?.slice(0, 60) || "Block";
      return { title: `${icon} ${title}` };
    },
  },
};

export const projectType = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [

    // ── LANDING OVERVIEW ──────────────────────────────────────
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order on the landing page. Lower = first.",
    },
    {
      name: "mobileOrder",
      title: "Mobile Display Order",
      type: "number",
      description: "Controls order on mobile. Falls back to Display Order if empty.",
    },
    {
      name: "client",
      title: "Client",
      type: "string",
      description: "Client or company name shown on the landing card.",
    },
    {
      name: "year",
      title: "Year",
      type: "string",
    },
    {
      name: "about",
      title: "About",
      type: "text",
      rows: 2,
      description: "Short description shown on the landing card. 1–2 sentences.",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: 'e.g. "UX Research", "Design Systems", "Brand Strategy"',
    },

    // ── IDENTITY ──────────────────────────────────────────────
    {
      name: "title",
      title: "Title (Real)",
      type: "string",
      description: "The actual project/company name. Always stored here.",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "nda",
      title: "NDA",
      type: "boolean",
      initialValue: false,
      description: "If true, public-facing pages show ndaTitle instead of title.",
    },
    {
      name: "ndaTitle",
      title: "NDA Title (Public)",
      type: "string",
      description: "Shown publicly when NDA is on. e.g. 'Construction SaaS Platform'",
      hidden: ({ document }: { document: { nda?: boolean } }) => !document?.nda,
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: { nda?: boolean; ndaTitle?: string; title?: string }) =>
          doc.nda && doc.ndaTitle ? doc.ndaTitle : (doc.title ?? ""),
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },

    // ── TOGGLES ───────────────────────────────────────────────
    {
      name: "isExternal",
      title: "External Link Only",
      type: "boolean",
      initialValue: false,
      description: "If true, links to an external URL. No case study page.",
    },
    {
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !document?.isExternal,
    },
    {
      name: "isLive",
      title: "Case Study Live",
      type: "boolean",
      initialValue: false,
      description: "If false, hovering shows 'Coming Soon'.",
    },
    {
      name: "showResearch",
      title: "Show Research Chapter",
      type: "boolean",
      initialValue: false,
      description: "Turn on for academic or research-heavy projects.",
    },
    {
      name: "showIdeation",
      title: "Show Ideation Chapter",
      type: "boolean",
      initialValue: false,
      description: "Show ideation/concept exploration chapter.",
    },
    {
      name: "showIteration",
      title: "Show Iteration Chapter",
      type: "boolean",
      initialValue: false,
      description: "Show iteration/process/decisions chapter.",
    },
    {
      name: "showNextSteps",
      title: "Show Next Steps",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "showLearnings",
      title: "Show Learnings",
      type: "boolean",
      initialValue: false,
    },

    // ── HEADER ────────────────────────────────────────────────
    {
      name: "projectCategory",
      title: "Project Category",
      type: "string",
      description: 'e.g. "Dashboard & App", "Invoicing Platform"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Large hero statement. One sentence.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 2,
      description: "Subtext below the headline. 1–2 sentences.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "solutionLabel",
      title: "Solution Chapter Label",
      type: "string",
      description: 'Override "Solution" e.g. "The Platform", "What We Built"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "researchLabel",
      title: "Research Chapter Label",
      type: "string",
      description: 'Override "Research" e.g. "Discovery", "User Research"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "ideationLabel",
      title: "Ideation Chapter Label",
      type: "string",
      description: 'Override "Ideation" e.g. "Concepting"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "iterationLabel",
      title: "Iteration Chapter Label",
      type: "string",
      description: 'Override "Iteration" e.g. "Design Decisions", "Process"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },

    // ── METADATA ──────────────────────────────────────────────
    {
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "6 months" or "10 weeks"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      description: 'e.g. "Lead Product Designer"',
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "team",
      title: "Team",
      type: "array",
      of: [{ type: "string" }],
      description: "Leave empty for solo projects.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "skills",
      title: "Skills / Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Detailed skill tags for the case study page.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Client", value: "Client" },
          { title: "Academic", value: "Academic" },
        ],
        layout: "radio",
      },
    },

    // ── THUMBNAIL ─────────────────────────────────────────────
    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    },

    // ── OVERVIEW ──────────────────────────────────────────────
    {
      name: "overviewBody",
      title: "Overview Body",
      type: "text",
      rows: 4,
      description: "Context paragraph shown below thumbnail. e.g. project background or 'How might we...'",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },

    // ── PROBLEM ───────────────────────────────────────────────
    {
      name: "hook",
      title: "Hook / Problem Statement",
      type: "text",
      rows: 3,
      description: "Opening problem statement shown as large italic text.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "keyGaps",
      title: "Key Gaps",
      type: "array",
      description: "Shown as callout cards in the Problem section.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [{ type: "string" }],
    },

    // ── SOLUTION / FEATURES ───────────────────────────────────
    {
      name: "features",
      title: "Features / Solution",
      type: "array",
      description: "Each feature: number, title, description, and media.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "number", title: "Number", type: "string", description: 'e.g. "01"' },
            { name: "featureTitle", title: "Feature Title", type: "string" },
            { name: "featureDescription", title: "Feature Description", type: "text", rows: 3 },
            {
              name: "mediaType",
              title: "Media Type",
              type: "string",
              options: {
                list: [
                  { title: "Image Gallery", value: "gallery" },
                  { title: "Video (URL)", value: "video" },
                  { title: "None", value: "none" },
                ],
                layout: "radio",
              },
              initialValue: "gallery",
            },
            {
              name: "images",
              title: "Images",
              type: "array",
              description: "Upload one or more images. Multiple = gallery grid.",
              hidden: ({ parent }: { parent: { mediaType?: string } }) =>
                parent?.mediaType !== "gallery",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
                    { name: "caption", title: "Caption", type: "string" },
                  ],
                  preview: { select: { title: "caption", media: "image" } },
                },
              ],
            },
            {
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              description: "Direct .mp4, Loom, or YouTube URL.",
              hidden: ({ parent }: { parent: { mediaType?: string } }) =>
                parent?.mediaType !== "video",
            },
          ],
          preview: {
            select: { title: "featureTitle", subtitle: "number" },
          },
        },
      ],
    },

    // ── RESEARCH BLOCKS ───────────────────────────────────────
    {
      name: "researchBlocks",
      title: "Research Blocks",
      type: "array",
      description: "Add blocks of text, images, insights, quotes, or videos.",
      hidden: ({ document }: { document: { showResearch?: boolean } }) =>
        !document?.showResearch,
      of: [contentBlock],
    },

    // ── IDEATION BLOCKS ───────────────────────────────────────
    {
      name: "ideationBlocks",
      title: "Ideation Blocks",
      type: "array",
      description: "Add blocks of text, images, insights, quotes, or videos.",
      hidden: ({ document }: { document: { showIdeation?: boolean } }) =>
        !document?.showIdeation,
      of: [contentBlock],
    },

    // ── ITERATION BLOCKS ──────────────────────────────────────
    {
      name: "iterationBlocks",
      title: "Iteration Blocks",
      type: "array",
      description: "Document your process, decisions, and iterations.",
      hidden: ({ document }: { document: { showIteration?: boolean } }) =>
        !document?.showIteration,
      of: [contentBlock],
    },

    // ── OUTCOME BLOCKS ────────────────────────────────────────
    {
      name: "outcomeBlocks",
      title: "Outcome Blocks",
      type: "array",
      description: "Results, impact, metrics. Use blocks for richer content.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [contentBlock],
    },

    // ── NEXT STEPS BLOCKS ─────────────────────────────────────
    {
      name: "nextStepsBlocks",
      title: "Next Steps Blocks",
      type: "array",
      hidden: ({ document }: { document: { showNextSteps?: boolean } }) =>
        !document?.showNextSteps,
      of: [contentBlock],
    },

    // ── LEARNINGS BLOCKS ──────────────────────────────────────
    {
      name: "learningsBlocks",
      title: "Learnings Blocks",
      type: "array",
      hidden: ({ document }: { document: { showLearnings?: boolean } }) =>
        !document?.showLearnings,
      of: [contentBlock],
    },

    // ── LEGACY ────────────────────────────────────────────────
    {
      name: "screens",
      title: "Screens (Legacy)",
      type: "array",
      description: "Kept for backward compatibility. Use Features for new projects.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      name: "processImages",
      title: "Process Images (Legacy)",
      type: "array",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
    },
    {
      name: "diagrams",
      title: "Diagrams (Legacy)",
      type: "array",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "diagramTitle", title: "Diagram Title", type: "string" },
            { name: "diagramImage", title: "Diagram Image", type: "image", options: { hotspot: true } },
          ],
          preview: { select: { title: "diagramTitle", media: "diagramImage" } },
        },
      ],
    },
  ],
};