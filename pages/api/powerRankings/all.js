/**
 * API endpoint for fetching all weekly power rankings
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // In a real implementation, this would fetch from a database
  const allRankings = [
    { weekStart: "2025-03-17", weekEnd: "2025-03-23", slug: "march-17-2025", published: true },
    { weekStart: "2025-03-10", weekEnd: "2025-03-16", slug: "march-10-2025", published: true },
    { weekStart: "2025-03-03", weekEnd: "2025-03-09", slug: "march-03-2025", published: true },
    { weekStart: "2025-02-24", weekEnd: "2025-03-02", slug: "february-24-2025", published: true }
  ];

  res.status(200).json(allRankings);
}