// Sanity project schema
// Use this in your Sanity Studio at sanity/schemaTypes/project.ts

export const projectType = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    // ── LANDING OVERVIEW (always shown) ───────────────────────
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
      description: "If true, this project links out to an external URL. No case study page inside the site.",
    },
    {
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "The external link to open when clicked.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !document?.isExternal,
    },
    {
      name: "isLive",
      title: "Case Study Live",
      type: "boolean",
      initialValue: false,
      description: "If false, hovering shows 'Coming Soon' instead of 'View Case Study'.",
    },

    // ── HEADER ────────────────────────────────────────────────
    {
      name: "projectCategory",
      title: "Project Category",
      type: "string",
      description: 'Short descriptor shown in header. e.g. "Dashboard & App", "Invoicing Platform"',
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
      description: "Team members. Leave empty for solo projects.",
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

    // ── CASE STUDY CHAPTERS ───────────────────────────────────
    {
      name: "hook",
      title: "Hook",
      type: "text",
      rows: 3,
      description: "Opening paragraph. 2–3 sentences max.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "context",
      title: "Context",
      type: "text",
      rows: 4,
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 4,
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },
    {
      name: "decisions",
      title: "Design Decisions",
      type: "array",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "decisionTitle", title: "Decision Title", type: "string" },
            { name: "decisionBody", title: "Decision Body", type: "text", rows: 4 },
          ],
          preview: {
            select: { title: "decisionTitle" },
          },
        },
      ],
    },
    {
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
    },

    // ── FEATURES ──────────────────────────────────────────────
    {
      name: "features",
      title: "Features",
      type: "array",
      description: "Each feature: number, headline, description, and a video or image.",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            {
              name: "number",
              title: "Number",
              type: "string",
              description: 'e.g. "01"',
            },
            {
              name: "featureTitle",
              title: "Feature Title",
              type: "string",
            },
            {
              name: "featureDescription",
              title: "Feature Description",
              type: "string",
              description: "One line.",
            },
            {
              name: "mediaType",
              title: "Media Type",
              type: "string",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Video (URL)", value: "video" },
                ],
                layout: "radio",
              },
              initialValue: "image",
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }: { parent: { mediaType?: string } }) =>
                parent?.mediaType !== "image",
            },
            {
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              description: "Direct .mp4 URL or Loom/YouTube embed URL.",
              hidden: ({ parent }: { parent: { mediaType?: string } }) =>
                parent?.mediaType !== "video",
            },
          ],
          preview: {
            select: {
              title: "featureTitle",
              subtitle: "number",
              media: "image",
            },
          },
        },
      ],
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
      title: "Process Images",
      type: "array",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: {
            select: { title: "caption", media: "image" },
          },
        },
      ],
    },
    {
      name: "diagrams",
      title: "Diagrams",
      type: "array",
      hidden: ({ document }: { document: { isExternal?: boolean } }) => !!document?.isExternal,
      of: [
        {
          type: "object",
          fields: [
            { name: "diagramTitle", title: "Diagram Title", type: "string" },
            { name: "diagramImage", title: "Diagram Image", type: "image", options: { hotspot: true } },
          ],
          preview: {
            select: { title: "diagramTitle", media: "diagramImage" },
          },
        },
      ],
    },
  ],
};