// schema/scoreExplanation.js
import { defineType } from 'sanity';

export const scoreExplanation = defineType({
  name: 'scoreExplanation',
  title: 'Score Explanation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short title for the score explanation',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }], // This enables rich text editing.
      description: 'The detailed explanation of how the score works'
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
});