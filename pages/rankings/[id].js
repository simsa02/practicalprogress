import { createClient } from 'next-sanity';
import { groq } from 'next-sanity';
import { useRouter } from 'next/router';
import PowerRankings from '../rankings'; // reuses your existing component
import fs from 'fs';
import fsExtra from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import Fuse from 'fuse.js';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

const query = groq`
  *[_type == "weeklyPowerRanking" && _id == $id][0]{
    week,
    summary,
    entries[] {
      _key,
      name,
      rank,
      lastRank,
      metascore,
      coreScores,
      mediaBreakdown,
      financeBreakdown,
      legislativeDetails,
      ideologyRaw,
      summary,
      justification,
      votes,
      timestamp
    }
  }
`;

export async function getStaticPaths() {
  const allWeeks = await client.fetch(`*[_type == "weeklyPowerRanking"]{_id}`);
  const paths = allWeeks.map((r) => ({ params: { id: r._id } }));

  return {
    paths,
    fallback: false // or true if you want incremental rendering
  };
}

export async function getStaticProps({ params }) {
  const data = await client.fetch(query, { id: params.id });

  const cachePath = path.join(process.cwd(), 'legislators_cache.json');
  const yamlPath = path.join(process.cwd(), 'legislators-current.yaml');

  let legislatorsCache = {};
  let yamlData = [];

  try {
    legislatorsCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } catch (e) {
    console.error('Could not load legislator cache.');
  }

  try {
    yamlData = yaml.load(fsExtra.readFileSync(yamlPath, 'utf-8'));
  } catch (e) {
    console.error('Could not load YAML data.');
  }

  const fuse = new Fuse(yamlData, {
    keys: ['name.official_full'],
    threshold: 0.3,
    distance: 100,
  });

  const bioguideMap = {};
  data.entries.forEach((entry) => {
    const result = fuse.search(entry.name);
    if (result.length > 0) {
      const matched = result[0].item;
      bioguideMap[entry.name] = matched.id?.bioguide || null;
    }
  });

  if (!data || !data.entries) {
    return { notFound: true };
  }

  return {
    props: {
      rankings: data.entries,
      week: data.week,
      summary: data.summary,
      legislatorsCache,
      bioguideMap,
    },
    revalidate: 60,
  };
}

export default function PastWeekPage(props) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  return <PowerRankings {...props} />;
}
