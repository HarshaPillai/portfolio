// Sanity project schema
// Use this in your Sanity Studio at sanity/schemaTypes/project.ts

export const projectType = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "year",
      title: "Year",
      type: "string",
    },
    {
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "6 months" or "Q1–Q3 2024"',
    },
    {
      name: "role",
      title: "Role",
      type: "string",
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
    {
      name: "nda",
      title: "NDA",
      type: "boolean",
      initialValue: false,
      description: "If true, thumbnail stays blurred and content requires a password.",
    },
    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "hook",
      title: "Hook",
      type: "text",
      rows: 3,
      description: "One-line project hook shown in the listing.",
    },
    {
      name: "context",
      title: "Context",
      type: "text",
      rows: 4,
    },
    {
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 4,
    },
    {
      name: "decisions",
      title: "Design Decisions",
      type: "array",
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
    },
    {
      name: "screens",
      title: "Screens",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      name: "processImages",
      title: "Process Images",
      type: "array",
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
