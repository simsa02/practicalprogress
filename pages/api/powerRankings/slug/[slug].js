/**
 * API endpoint for fetching power rankings by slug
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: 'Slug is required' });
  }

  // In a real implementation, this would fetch from a database based on the slug
  const weeklyRankings = {
    weekStart: "2025-03-17",
    weekEnd: "2025-03-23", 
    slug, 
    published: true,
    rankings: [
      {
        id: '1',
        name: 'Alexandria Ocasio-Cortez',
        position: 'U.S. Representative',
        party: 'Democrat',
        rank: 1,
        metaScore: 87,
        trending: 2
      },
      {
        id: '2',
        name: 'Bernie Sanders',
        position: 'U.S. Senator',
        party: 'Independent',
        rank: 2,
        metaScore: 84,
        trending: 1
      }
    ]
  };

  res.status(200).json(weeklyRankings);
}