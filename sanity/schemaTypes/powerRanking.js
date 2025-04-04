import { defineType } from 'sanity';

export const powerRanking = defineType({
  name: 'powerRanking',
  title: 'Power Ranking',
  type: 'document',
  fields: [
    // Existing fields
    {
      name: 'week',
      title: 'Week',
      type: 'date',
      description: 'The week these rankings apply to',
      validation: Rule => Rule.required()
    },
    {
      name: 'rank',
      title: 'Rank',
      type: 'number',
      description: 'Position in the rankings',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the politician',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'previousRank',
      title: 'Previous Rank',
      type: 'number',
      description: "Position in previous week's rankings (optional)",
      validation: Rule => Rule.integer()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this ranking should be displayed',
      initialValue: true
    },
    // Additional fields from your imported data
    {
      name: 'baseline_score',
      title: 'Baseline Score',
      type: 'number',
      description: 'Baseline score metric'
    },
    {
      name: 'controversy',
      title: 'Controversy',
      type: 'number',
      description: 'Controversy metric'
    },
    {
      name: 'last_rank',
      title: 'Last Rank',
      type: 'number',
      description: 'Previous rank before the current ranking'
    },
    {
      name: 'legislation_score',
      title: 'Legislation Score',
      type: 'number',
      description: 'Score for legislative effectiveness'
    },
    {
      name: 'media_clout',
      title: 'Media Clout',
      type: 'number',
      description: 'Media clout score'
    },
    {
      name: 'news_score',
      title: 'News Score',
      type: 'number',
      description: 'Score based on news coverage'
    },
    {
      name: 'policy_impact',
      title: 'Policy Impact (Alt)',
      type: 'number',
      description: 'Alternate policy impact score'
    },
    {
      name: 'public_perception',
      title: 'Public Perception',
      type: 'number',
      description: 'Score for public perception'
    },
    {
      name: 'score',
      title: 'Score',
      type: 'number',
      description: 'Overall computed score'
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Summary analysis of the ranking'
    },
    {
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      description: 'When the data was recorded'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'week',
      media: 'photo',
      rank: 'rank'
    },
    prepare({ title, subtitle, media, rank }) {
      return {
        title: `#${rank} - ${title}`,
        subtitle: `Week of ${subtitle}`,
        media
      };
    }
  },
  orderings: [
    {
      title: 'Rank',
      name: 'rankAsc',
      by: [{ field: 'rank', direction: 'asc' }]
    },
    {
      title: 'Week, Newest',
      name: 'weekDesc',
      by: [
        { field: 'week', direction: 'desc' },
        { field: 'rank', direction: 'asc' }
      ]
    }
  ]
});
