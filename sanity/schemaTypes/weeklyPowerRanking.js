export default {
  name: 'weeklyPowerRanking',
  title: 'Weekly Power Ranking',
  type: 'document',
  fields: [
    {
      name: 'week',
      title: 'Week',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'weekTitle',
      title: 'Week Title (Optional)',
      type: 'string',
      description: 'Overrides the default "Week of [date]" title if set.'
    },
    {
      name: 'summary',
      title: 'Weekly AI Summary',
      type: 'blockContent'
    },
    {
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime'
    },
    {
      name: 'entries',
      title: 'Ranked Politicians',
      type: 'array',
      of: [{ type: 'politicianRankingEntry' }]
    }
  ],
  preview: {
    select: {
      week: 'week',
      weekTitle: 'weekTitle',
      generatedAt: 'generatedAt'
    },
    prepare({ week, weekTitle, generatedAt }) {
      return {
        title: weekTitle || `Week of ${week || 'Unknown'}`,
        subtitle: `Generated ${new Date(generatedAt).toLocaleDateString()}`
      };
    }
  }
};
