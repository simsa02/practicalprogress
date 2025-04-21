import { groq } from 'next-sanity';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

export default async function handler(req, res) {
  const { id } = req.query;
  
  const query = groq`
    *[_type == "weeklyPowerRanking"][0].entries[name == $id][0]{
      photoUrl,
      name,
      metascore,
      rank,
      summary,
      "optimizedPhoto": photoUrl.asset->url
    }
  `;

  try {
    const entry = await client.fetch(query, { id });
    if (!entry) return res.status(404).send('Not found');

    // Use optimized CDN URL if available
    const imageUrl = entry.optimizedPhoto 
      ? `${entry.optimizedPhoto}?w=1200&h=630&fit=crop`
      : entry.photoUrl 
        ? `https://practicalprogress.org${entry.photoUrl}`
        : 'https://practicalprogress.org/images/politicians/default-politician.jpg';

    const escapedName = encodeURIComponent(entry.name);
    const pageUrl = `https://practicalprogress.org/rankings#${escapedName.replace(/%20/g, '-')}`;
    
    const html = `
      <!DOCTYPE html>
      <html prefix="og: https://ogp.me/ns#">
      <head>
        <title>${entry.name} | Progressive Power Rankings</title>
        
        <!-- Essential Open Graph Tags -->
        <meta property="og:title" content="${entry.name}'s Progressive Power Ranking" />
        <meta property="og:description" content="Score: ${entry.metascore} | Rank: ${entry.rank}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${pageUrl}" />
        <meta property="og:type" content="website" />
        
        <!-- Image Dimensions -->
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="${entry.name}'s Progressive Power Ranking Card" />
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PracticalProgress" />
        <meta name="twitter:title" content="${entry.name}'s Ranking" />
        <meta name="twitter:description" content="Progressive Power Score: ${entry.metascore}" />
        <meta name="twitter:image" content="${imageUrl}" />
        
        <!-- Redirect -->
        <meta http-equiv="refresh" content="0; url=${pageUrl}" />
      </head>
      <body>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "name": "${entry.name}'s Progressive Ranking",
            "description": "Progressive Power Score: ${entry.metascore} | Rank: ${entry.rank}",
            "image": "${imageUrl}",
            "creator": {
              "@type": "Organization",
              "name": "Practical Progress"
            }
          }
        </script>
        <p>Redirecting to ${entry.name}'s ranking...<br>
        <a href="${pageUrl}">Click here if not redirected</a></p>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Share API error:', error);
    res.status(500).send('Server error');
  }
}