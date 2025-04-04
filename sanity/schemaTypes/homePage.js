// schemaTypes/homePage.js
import { defineType } from "sanity"; // Import defineType from the correct library
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    },
    {
      name: "ctaLink",
      title: "CTA Button Link",
      type: "string",
    },
  ],
});