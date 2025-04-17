export default {
  name: 'politicianRankingEntry',
  title: 'Politician Ranking Entry',
  type: 'object',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'chamber', type: 'string' },
    { name: 'state', type: 'string' },
    { name: 'party', type: 'string' },
    { name: 'photoUrl', type: 'url' },

    { name: 'rank', type: 'number' },
    { name: 'lastRank', type: 'number' },
    { name: 'metascore', type: 'number' },

    {
      name: 'coreScores',
      title: 'Core Scores',
      type: 'object',
      fields: [
        { name: 'weeklyMediaImpact', type: 'number' },
        { name: 'progressiveConsistency', type: 'number' },
        { name: 'legislativePower', type: 'number' },
        { name: 'ideology', type: 'number' },
        { name: 'finance', type: 'number' }
      ]
    },

    {
      name: 'mediaBreakdown',
      type: 'object',
      fields: [
        { name: 'policyImpact', type: 'number' },
        { name: 'publicPerception', type: 'number' },
        { name: 'controversy', type: 'number' },
        { name: 'mediaClout', type: 'number' }
      ]
    },

    {
      name: 'financeBreakdown',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'industry', type: 'string' },
            { name: 'amount', type: 'number' },
            { name: 'score', type: 'number' }
          ]
        }
      ]
    },

    {
      name: 'legislativeDetails',
      type: 'object',
      fields: [
        { name: 'tenure', type: 'number' },
        { name: 'committeeMemberships', type: 'array', of: [{ type: 'string' }] },
        { name: 'committeeLeaderships', type: 'array', of: [{ type: 'string' }] }
      ]
    },

    { name: 'ideologyRaw', type: 'number' },
    { name: 'summary', type: 'text' },

    {
      name: 'justification',
      title: 'Media Justification',
      type: 'blockContent'
    },

    {
      name: 'bills',
      title: 'Sponsored Bills',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'billNumber', type: 'string', title: 'Bill Number' },
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'statusDate', type: 'string', title: 'Status Date' },
          { name: 'url', type: 'url', title: 'URL' },
          { name: 'policyKeyword', type: 'string', title: 'Policy Keyword' },
          { name: 'progressiveScore', type: 'number', title: 'Progressive Score' }
        ]
      }]
    },

    {
      name: 'citations',
      title: 'Citations',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'source', type: 'string' },
          { name: 'url', type: 'url' },
          { name: 'published', type: 'string' }
        ]
      }]
    },

    {
      name: 'votes',
      type: 'object',
      fields: [
        { name: 'crucialLifetime', type: 'number' },
        { name: 'crucialCurrent', type: 'number' },
        { name: 'overallLifetime', type: 'number' },
        { name: 'overallCurrent', type: 'number' }
      ]
    },

    { name: 'timestamp', type: 'datetime' }
  ]
}
