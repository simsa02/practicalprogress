// practicalprogress‑main/pages/rankings/[id].js

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { createClient } from 'next-sanity';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import styles from '../../styles/PowerRankings.module.css';
import Link from 'next/link';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

// 1) Build all the valid detail-page paths at build time:
export async function getStaticPaths() {
  const doc = await client.fetch(
    groq`*[_type=="weeklyPowerRanking"] | order(week desc)[0] { entries[]{_key} }`
  );
  const paths = (doc.entries || []).map((e) => ({
    params: { id: e._key },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

// 2) Fetch one entry by its _key:
export async function getStaticProps({ params }) {
  const entry = await client.fetch(
    groq`
      *[_type=="weeklyPowerRanking"] | order(week desc)[0]
        .entries[_key == $key][0]
    `,
    { key: params.id }
  );

  if (!entry) {
    return { notFound: true };
  }

  return {
    props: { entry },
    revalidate: 60, // rebuild at most once per minute
  };
}

// 3) Render the detail page with full OG metadata **and** the complete breakdown:
export default function RankingDetail({ entry }) {
  const delta =
    entry.lastRank != null ? entry.lastRank - entry.rank : 0;

  const pageUrl = `${SITE_URL}/rankings/${entry._key}`;
  const ogImage = `${SITE_URL}/api/og/${entry._key}`;

  return (
    <>
      <Head>
        {/* Single text node title */}
        <title>{`Progressive Power Rankings – ${entry.name}`}</title>
        <meta
          name="description"
          content={`Details for ${entry.name}'s Progressive Power Ranking.`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:title"
          content={`${entry.name} — Metascore ${entry.metascore.toFixed(
            2
          )}`}
        />
        <meta
          property="og:description"
          content={`See how ${entry.name} moved in this week's Progressive Power Rankings.`}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <main className={styles.container}>
        <div className={styles.card} id={entry._key}>
          {/* HEADER ROW */}
          <div className={styles.headerRow}>
            <div className={styles.rank}>{entry.rank}</div>

            <div className={styles.photo}>
              <Image
                src={entry.photoUrl}
                alt={entry.name}
                width={100}
                height={100}
                className={styles.image}
                onError={(e) => {
                  e.currentTarget.src =
                    '/images/politicians/default-politician.jpg';
                }}
              />
            </div>

            <div className={styles.metaBlock}>
              <h2 className={styles.name}>{entry.name}</h2>
              <p className={styles.metascore}>
                Metascore: {entry.metascore.toFixed(2)}
              </p>
              <p
                className={styles.change}
                style={{
                  color: delta >= 0 ? 'green' : 'red',
                }}
              >
                {delta === 0
                  ? '—'
                  : delta > 0
                  ? `▲ ${delta}`
                  : `▼ ${Math.abs(delta)}`}{' '}
                from last week
              </p>
            </div>

            <Link href="/rankings" legacyBehavior>
              <a className={styles.backButton}>← Back to Rankings</a>
            </Link>
          </div>

          {/* LEVEL ONE: Summary & Core Scores */}
          <div className={styles.levelOne}>
            <p className={styles.summary}>{entry.summary}</p>

            <h4 className={styles.coreHeader}>⭐ Core Factors</h4>
            <div className={styles.coreScores}>
              <span className={styles.badge}>
                📰 Media Impact: {entry.coreScores?.weeklyMediaImpact}
              </span>
              <span className={styles.badge}>
                🗳️ Progressive Consistency:{' '}
                {entry.coreScores?.progressiveConsistency}
              </span>
              <span className={styles.badge}>
                🏛️ Legislative Power:{' '}
                {entry.coreScores?.legislativePower}
              </span>
              <span className={styles.badge}>
                🧭 Ideology: {entry.coreScores?.ideology}
              </span>
              <span className={styles.badge}>
                💰 Donor Ethics: {entry.coreScores?.finance}
              </span>
            </div>
          </div>

          {/* LEVEL TWO: Full Breakdown */}
          <div className={styles.levelTwo}>
            {/* Weekly News Summary */}
            {entry.justification && (
              <>
                <h4 className={styles.sectionTitle}>
                  🧠 <strong>Weekly News Summary</strong>
                </h4>
                <div className={styles.paragraph}>
                  <PortableText value={entry.justification} />
                </div>
              </>
            )}

            {/* Media Impact Breakdown */}
            <h4 className={styles.sectionTitle}>
              📰 <strong>Media Impact Breakdown</strong>
            </h4>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>
                <strong>Policy:</strong>{' '}
                {entry.mediaBreakdown?.policyImpact}
              </li>
              <li className={styles.badge}>
                <strong>Perception:</strong>{' '}
                {entry.mediaBreakdown?.publicPerception}
              </li>
              <li className={styles.badge}>
                <strong>Controversy:</strong>{' '}
                {entry.mediaBreakdown?.controversy}
              </li>
              <li className={styles.badge}>
                <strong>Clout:</strong>{' '}
                {entry.mediaBreakdown?.mediaClout}
              </li>
            </ul>

            {/* Voting Consistency */}
            <h4 className={styles.sectionTitle}>
              🗳️{' '}
              <strong>
                Progressive Voting Consistency via ProgressivePunch.org
              </strong>
            </h4>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>
                <strong>Crucial (Lifetime):</strong>{' '}
                {entry.votes?.crucialLifetime ?? 'N/A'}%
              </li>
              <li className={styles.badge}>
                <strong>Crucial (Current):</strong>{' '}
                {entry.votes?.crucialCurrent ?? 'N/A'}%
              </li>
              <li className={styles.badge}>
                <strong>Overall (Lifetime):</strong>{' '}
                {entry.votes?.overallLifetime ?? 'N/A'}%
              </li>
              <li className={styles.badge}>
                <strong>Overall (Current):</strong>{' '}
                {entry.votes?.overallCurrent ?? 'N/A'}%
              </li>
            </ul>

            {/* Donor Breakdown */}
            <h4 className={styles.sectionTitle}>
              💰 <strong>Top 3 Donor Industries via OpenSecrets.org</strong>
            </h4>
            {entry.financeBreakdown?.length > 0 ? (
              <ul className={styles.badgeList}>
                {entry.financeBreakdown.map((f) => (
                  <li
                    key={f._key}
                    className={styles.badge}
                  >
                    {f.industry}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.paragraph}>
                No donor data available.
              </p>
            )}

            {/* Ideology */}
            <h4 className={styles.sectionTitle}>
              🧭 <strong>Ideology</strong>
            </h4>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>
                <strong>Raw Score:</strong> {entry.ideologyRaw}
              </li>
            </ul>

            {/* Legislative Details */}
            <h4 className={styles.sectionTitle}>
              🏛️ <strong>Legislative Data via Congress.gov</strong>
            </h4>
            <ul className={styles.badgeList}>
              <li className={styles.badge}>
                <strong>Tenure:</strong>{' '}
                {entry.legislativeDetails?.tenure} years
              </li>
            </ul>

            {entry.legislativeDetails
              ?.committeeMemberships?.length > 0 && (
              <>
                <p className={styles.paragraph}>
                  <strong>Committee Memberships:</strong>
                </p>
                <ul className={styles.badgeList}>
                  {entry.legislativeDetails.committeeMemberships.map(
                    (c, i) => (
                      <li
                        key={`cm-${i}`}
                        className={styles.badge}
                      >
                        {c}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            {entry.legislativeDetails
              ?.committeeLeaderships?.length > 0 && (
              <>
                <p className={styles.paragraph}>
                  <strong>Leadership Roles:</strong>
                </p>
                <ul className={styles.badgeList}>
                  {entry.legislativeDetails.committeeLeaderships.map(
                    (c, i) => (
                      <li
                        key={`cl-${i}`}
                        className={styles.badge}
                      >
                        {c}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            {/* Sponsored Bills */}
            {entry.bills?.length > 0 && (
              <>
                <h4 className={styles.sectionTitle}>
                  📜 <strong>Sponsored Bills</strong>
                </h4>
                <ul className={styles.billList}>
                  {entry.bills.map((bill) => (
                    <li
                      key={bill._key}
                      className={styles.billItem}
                    >
                      <a
                        href={bill.url}
                        className={styles.billLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {bill.billNumber}: {bill.title}
                      </a>
                      <p className={styles.billMeta}>
                        <strong>Keyword:</strong>{' '}
                        {bill.policyKeyword} |{' '}
                        <strong>Score:</strong>{' '}
                        {bill.progressiveScore} |{' '}
                        <strong>Date:</strong> {bill.statusDate}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* News Citations */}
            {entry.citations?.length > 0 && (
              <>
                <h4 className={styles.sectionTitle}>
                  🔗 <strong>News Citations</strong>
                </h4>
                <ul className={styles.citationList}>
                  {entry.citations.map((c) => (
                    <li
                      key={c._key}
                      className={styles.citationItem}
                    >
                      <a
                        href={c.url}
                        className={styles.citationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.title} ({c.source},{' '}
                        {new Date(c.published).toLocaleDateString()})
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
