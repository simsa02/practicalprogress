import { defineType } from "sanity";
export const editorial = defineType({
  name: "editorial",
  title: "Editorials",
  type: "document",
  fields: [
    // ... other fields ...
    {
      name: "slug",
      title: "Slug",
      type: "slug",
          options: {
        source: "title",
        maxLength: 96
          },
      validation: Rule => Rule.required(),
        },
    // ... rest of your fields ...
  ]
});
