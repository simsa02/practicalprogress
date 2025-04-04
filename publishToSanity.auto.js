// publishToSanity.auto.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { sanityWriteClient } from './lib/sanityClient.js';
import { getPoliticianImageUrl } from './lib/getPoliticianImageUrl.js';
import { uploadImageToSanity } from './lib/uploadPoliticianImage.js';
import { generateWriteup } from './lib/ai/generateWriteup.js';
import { generateWeeklySummary } from './lib/ai/generateWeeklySummary.js';

const DATA_DIR = path.join(process.cwd(), 'data', 'powerRankings');
const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));
const sortedFiles = files.sort().reverse();
const latestFile = sortedFiles[0];
const previousFile = sortedFiles[1];
const filePath = path.join(DATA_DIR, latestFile);
const weekDate = latestFile.replace('.json', '');

const politicians = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const previous = previousFile ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, previousFile), 'utf8')) : [];

const getPreviousRank = (name) => {
  const prev = previous.find(p => p.name === name);
  return prev ? previous.indexOf(prev) + 1 : null;
};

async function publishRankings() {
  console.log(`\n📦 Uploading ${politicians.length} rankings for week ${weekDate}...`);

  const createdRankings = [];
  const top25 = politicians.slice(0, 25);

  for (let i = 0; i < top25.length; i++) {
    const person = top25[i];
    const imageUrl = await getPoliticianImageUrl(person.name);
    const sanityAssetId = await uploadImageToSanity(imageUrl, person.name);

    const currentRank = i + 1;
    const previousRank = getPreviousRank(person.name);
    let trend = 'new';

    if (previousRank !== null) {
      if (previousRank < currentRank) trend = 'down';
      else if (previousRank > currentRank) trend = 'up';
      else trend = 'same';
    }

    const writeup = await generateWriteup({
      name: person.name,
      state: person.state,
      party: person.party,
      rank: currentRank,
      scores: person.scores,
      highlights: person.highlights,
      previousRank
    });

    const doc = {
      _type: 'powerRanking',
      name: person.name,
      level: person.level,
      party: person.party,
      state: person.state,
      metaScore: person.total,
      scores: person.scores,
      writeup,
      highlights: person.highlights || [],
      currentRank,
      previousRank,
      trend,
      image: sanityAssetId ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: sanityAssetId
        }
      } : undefined
    };

    try {
      const created = await sanityWriteClient.create(doc);
      createdRankings.push({ _type: 'reference', _ref: created._id });
    } catch (err) {
      console.error(`❌ Failed to create doc for ${person.name}:`, err.message);
    }
  }

  const weeklySummary = await generateWeeklySummary(top25);

  try {
    await sanityWriteClient.create({
      _type: 'powerRankingWeek',
      weekDate,
      title: `Week of ${weekDate} Rankings`,
      summary: weeklySummary,
      rankings: createdRankings,
      isPublished: true,
      publishDate: new Date().toISOString()
    });
    console.log(`✅ Successfully published rankings for week ${weekDate}`);
  } catch (err) {
    console.error('❌ Failed to publish weekly document:', err.message);
  }
}

publishRankings();
