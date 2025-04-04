// schema/powerRankingWeek.js
import { defineType } from 'sanity';

export const powerRankingWeek = defineType({
  name: 'powerRankingWeek',
  title: 'Power Ranking Week',
  type: 'document',
  fields: [
    {
      name: 'weekDate',
      title: 'Week Date',
      type: 'date',
      description: 'Date of this ranking week',
      validation: Rule => Rule.required()
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [{ type: 'block' }], // Portable Text format for rich text editing.
      description: 'Weekly summary of the power rankings'
    },
    {
      name: 'generated_at',
      title: 'Generated At',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'weekDate',
      subtitle: 'summary'
    },
    prepare({ title, subtitle }) {
      return { title: `Week of ${title}`, subtitle };
    }
  }
});
