import { groq } from 'next-sanity';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});

export async function getServerSideProps({ params, req }) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|twitter|facebook|google|pinterest|linkedin/i.test(userAgent);
  
  const entry = await client.fetch(groq`
    *[_type == "weeklyPowerRanking"][0].entries[name == $name][0]{
      name,
      photoUrl,
      metascore,
      rank,
      summary
    }
  `, { name: decodeURIComponent(params.name) });

  if (!entry) return { notFound: true };

  // Handle external image URLs
  let imageUrl = entry.photoUrl || '/images/politicians/default-politician.jpg';
  if (!imageUrl.startsWith('http')) {
    imageUrl = imageUrl.startsWith('/') 
      ? `https://practicalprogress.org${imageUrl}`
      : `https://practicalprogress.org/images/politicians/${imageUrl}`;
  }

  const pageUrl = `https://practicalprogress.org/rankings#${encodeURIComponent(entry.name.replace(/\s+/g, '-'))}`;

  return {
    props: {
      isBot,
      data: {
        ...entry,
        imageUrl,
        pageUrl
      }
    }
  };
}

export default function SharePage({ isBot, data }) {
  if (!isBot && typeof window !== 'undefined') {
    window.location.href = data.pageUrl;
    return null;
  }

  return (
    <head>
      <title>{data.name} - Progressive Power Ranking</title>
      <meta property="og:title" content={`${data.name}'s Progressive Ranking`} />
      <meta property="og:description" content={`Score: ${data.metascore} | Rank: ${data.rank}`} />
      <meta property="og:image" content={data.imageUrl} />
      <meta property="og:url" content={data.pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${data.name}'s Ranking`} />
      <meta name="twitter:description" content={`Progressive Score: ${data.metascore}`} />
      <meta name="twitter:image" content={data.imageUrl} />
      
      <meta http-equiv="refresh" content={`0; url=${data.pageUrl}`} />
    </head>
  );
}