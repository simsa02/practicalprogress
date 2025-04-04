import { defineType } from "sanity";

export const editorial = defineType({
  name: "editorial",
  title: "Editorials",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/:/g, "") // Remove colons explicitly
            .replace(/[^a-z0-9-]/g, "-") // Replace invalid characters with hyphens
            .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
            .slice(0, 96), // Enforce maxLength
      },
    }
  ],
  preview: {
    select: {
      title: "title",
      publishedDate: "publishedDate",
      description: "description",
    },
    prepare({ title, publishedDate, description }) {
      return {
        title,
        subtitle: publishedDate
          ? new Date(publishedDate).toLocaleDateString()
          : "No date",
        description,
      };
    },
  },
});
