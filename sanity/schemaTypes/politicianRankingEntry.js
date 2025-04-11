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
      { name: 'newsSummary', type: 'text' },
      { name: 'votes', type: 'object', fields: [
        { name: 'crucialLifetime', type: 'number' },
        { name: 'crucialCurrent', type: 'number' },
        { name: 'overallLifetime', type: 'number' },
        { name: 'overallCurrent', type: 'number' }
      ]},
      { name: 'timestamp', type: 'datetime' }
    ]
  }
  