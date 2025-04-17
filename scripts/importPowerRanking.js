// --- scripts/importPowerRanking.js ---
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { randomUUID } from 'crypto';

console.log("Using Sanity token (first 10 chars):", process.env.SANITY_API_TOKEN?.slice(0, 10) + "...");

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'xf8ueo0c',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-01-01',
});

// Resolve path from project root
const filePath = path.resolve(process.cwd(), "data", "powerRankings", "combined_rankings_2025-04-17.json");

// Convert plain string to blockContent format
function toBlock(text) {
  return [{
    _type: 'block',
    style: 'normal',
    children: [{
      _type: 'span',
      text,
      marks: []
    }]
  }];
}

async function run() {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const { meta, rankings } = data;

  const entries = rankings.map((r) => ({
    _key: randomUUID(),
    _type: "politicianRankingEntry",
    name: r.name,
    chamber: r.chamber,
    state: r.state,
    party: r.party,
    photoUrl: r.photoUrl,

    rank: r.rank,
    lastRank: r.lastRank,
    metascore: r.metascore,

    coreScores: {
      weeklyMediaImpact: r.weeklyMediaImpact?.total || 0,
      progressiveConsistency: r.progressiveConsistency?.total || 0,
      legislativePower: r.legislativePower?.total || 0,
      ideology: r.ideology?.score || 0,
      finance: r.finance?.score || 0,
    },

    mediaBreakdown: {
      policyImpact: r.weeklyMediaImpact?.policyImpact || 0,
      publicPerception: r.weeklyMediaImpact?.publicPerception || 0,
      controversy: r.weeklyMediaImpact?.controversy || 0,
      mediaClout: r.weeklyMediaImpact?.mediaClout || 0,
    },

    // Use existing 'justification' field in schema
    justification: toBlock(r.weeklyMediaImpact?.justification || ""),

    financeBreakdown: (r.finance?.topIndustries || []).slice(0, 3).map((donor) => ({
      _key: randomUUID(),
      industry: donor.industry,
      amount: donor.amount,
      score: donor.score
    })),

    legislativeDetails: {
      tenure: r.legislativePower?.tenure || 0,
      committeeMemberships: r.legislativePower?.committeeMembershipNames || [],
      committeeLeaderships: r.legislativePower?.committeeLeadershipNames || [],
    },

    ideologyRaw: r.ideology?.rawIdeologyScore || 0,
    summary: r.summary || "",

    bills: (r.legislativePower?.bills || []).map(bill => ({
      _key: randomUUID(),
      billNumber: bill.bill_number,
      title: bill.title,
      statusDate: bill.status_date,
      url: bill.url,
      policyKeyword: bill.policy_keyword,
      progressiveScore: bill.progressive_score
    })),

    citations: (r.weeklyMediaImpact?.citations || []).map(citation => ({
      _key: randomUUID(),
      title: citation.title,
      source: citation.source,
      url: citation.url,
      published: citation.published
    })),

    votes: {
      crucialLifetime: r.votes?.crucialLifetime || 0,
      crucialCurrent: r.votes?.crucialCurrent || 0,
      overallLifetime: r.votes?.overallLifetime || 0,
      overallCurrent: r.votes?.overallCurrent || 0,
    },

    timestamp: r.timestamp
  }));

  const doc = {
    _type: "weeklyPowerRanking",
    week: meta.week,
    summary: toBlock(meta.summary),
    generatedAt: meta.generated_at,
    entries
  };

  await client.create(doc);
  console.log("✅ Weekly Power Ranking created");
}

(async () => {
  try {
    await run();
  } catch (err) {
    console.error("❌ Import failed:", err);
  }
})();
