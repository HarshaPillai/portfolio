import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "tagline",  title: "Tagline",  type: "string" }),
    defineField({ name: "year",     title: "Year",     type: "number" }),
    defineField({ name: "client",   title: "Client",   type: "string" }),
    defineField({ name: "order",    title: "Order",    type: "number" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "hook",
      title: "Hook",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body",     title: "Body",     type: "text" }),
      ],
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body",     title: "Body",     type: "text" }),
      ],
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "object",
      fields: [
        defineField({ name: "headline",              title: "Headline",               type: "string" }),
        defineField({ name: "body",                  title: "Body",                   type: "text" }),
        defineField({ name: "pullQuote",             title: "Pull Quote",             type: "string" }),
        defineField({ name: "pullQuoteAttribution",  title: "Pull Quote Attribution", type: "string" }),
      ],
    }),
    defineField({
      name: "keyDecisions",
      title: "Key Decisions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "decisionNumber", title: "Decision Number", type: "string" }),
            defineField({ name: "headline",        title: "Headline",        type: "string" }),
            defineField({ name: "body",            title: "Body",            type: "text" }),
          ],
          preview: { select: { title: "headline" } },
        },
      ],
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body",     title: "Body",     type: "text" }),
      ],
    }),
    defineField({
      name: "selectedScreens",
      title: "Selected Screens",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Alt Text", type: "string" }),
              ],
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
    }),
    defineField({
      name: "nextProject",
      title: "Next Project",
      type: "reference",
      to: [{ type: "project" }],
    }),
  ],
});
