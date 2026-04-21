export const labItemType = {
  name: "labItem",
  title: "Lab Item",
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
      options: { source: "title" },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
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
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Lightbox", value: "lightbox" },
          { title: "External", value: "external" },
        ],
      },
    },
    {
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Only used when type is 'external'",
    },
    {
      name: "contentType",
      title: "Content Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Gallery", value: "gallery" },
          { title: "Embed", value: "embed" },
        ],
      },
    },
    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "WIP", value: "wip" },
          { title: "Archived", value: "archived" },
        ],
      },
    },
  ],
};
