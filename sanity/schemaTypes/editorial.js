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
/*************  ✨ Codeium Command 🌟  *************/
        /**
         * Slugify the input string.
         * @param {string} input - The input string to slugify.
         * @returns {string} The slugified string.
         */
        slugify: (input) => {
          // Replace newline characters with a space
          const replacedNewlines = input.replace(/\n/g, " ");
          // Trim leading/trailing whitespace
          const trimmed = replacedNewlines.trim();
          // Convert to lowercase
          const lowerCased = trimmed.toLowerCase();
          // Replace spaces with dashes
          const replacedSpaces = lowerCased.replace(/\s+/g, "-");

          return replacedSpaces;
        },
        slugify: (input) =>
          input
            .replace(/\n/g, " ")        // Replace newline characters with a space
            .trim()                     // Trim leading/trailing whitespace
            .toLowerCase()              // Convert to lowercase
            .replace(/\s+/g, "-")       // Replace spaces with dashes
/******  1e15df8d-d007-45d1-9c14-46fe9c8fd7c5  *******/
      },
      validation: (Rule) => Rule.required(),
    },
    // Add any additional fields as needed.
  ],
  preview: {
    select: {
      title: "title",
      publishedDate: "publishedDate",
      description: "description"
    },
    prepare({ title, publishedDate, description }) {
      return {
        title,
        subtitle: publishedDate ? new Date(publishedDate).toLocaleDateString() : "No date",
        description,
      };
    },
  },
});