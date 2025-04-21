// practicalprogress-main/pages/rankings/index.js

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import fs from 'fs'
import fsExtra from 'fs-extra'
import yaml from 'js-yaml'
import Fuse from 'fuse.js'
import path from 'path'
import styles from '../../styles/PowerRankings.module.css'
import ShareButtons from '../../components/ShareButtons'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com'

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

const query = groq`
  *[_type == "weeklyPowerRanking"]
    | order(week desc)[0]{
      week,
      summary,
      entries[]{
        _key, name, photoUrl, rank, lastRank, metascore,
        coreScores, mediaBreakdown, financeBreakdown,
        legislativeDetails, ideologyRaw, summary, justification, votes,
        bills[]{ _key, billNumber, title, url, policyKeyword, progressiveScore, statusDate },
        citations[]{ _key, title, url, source, published }
      }
    }
`

export async function getStaticProps() {
  const data = await client.fetch(query)

  /* load caches to resolve bioguide → local headshot */
  const cachePath = path.join(process.cwd(), 'legislators_cache.json')
  const yamlPath  = path.join(process.cwd(), 'legislators-current.yaml')

  let legislatorsCache = {}
  let yamlData = []
  try { legislatorsCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8')) } catch {}
  try { yamlData = yaml.load(fsExtra.readFileSync(yamlPath, 'utf-8')) } catch {}

  const fuse = new Fuse(yamlData, {
    keys: ['name.official_full'],
    threshold: 0.3,
    distance: 100,
  })

  const bioguideMap = {}
  ;(data.entries || []).forEach(entry => {
    const cacheMatch = legislatorsCache[entry.name]?.bioguide
    if (cacheMatch) {
      bioguideMap[entry.name] = cacheMatch
      return
    }
    const result = fuse.search(entry.name)
    if (result.length > 0) {
      bioguideMap[entry.name] = result[0].item.id?.bioguide || null
    }
  })

  if (!data?.entries) return { notFound: true }

  return {
    props: {
      rankings: data.entries,
      week: data.week,
      summary: data.summary,
      legislatorsCache,
      bioguideMap,
    },
    revalidate: 60,
  }
}
/* helper: PortableText → plain text */
const toPlainText = blocks =>
  Array.isArray(blocks)
    ? blocks
        .map(b => (b.children ? b.children.map(c => c.text).join(' ') : ''))
        .join(' ')
    : ''

export default function PowerRankings({
  rankings,
  week,
  summary,
  legislatorsCache,
  bioguideMap,
}) {
  const [selectedState,   setSelectedState]   = useState('All')
  const [selectedChamber, setSelectedChamber] = useState('All')
  const [searchTerm,      setSearchTerm]      = useState('')
  const [visibleCount,    setVisibleCount]    = useState(25)
  const [showFullSummary, setShowFullSummary] = useState(false)
  const [sortMetric,      setSortMetric]      = useState('')
  const [sortOrder,       setSortOrder]       = useState('desc')

  const truncateSummary = (text, wordLimit = 40) => {
    if (typeof text !== 'string') return ''
    const words = text.split(' ')
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '…' : text
  }

  /* dropdown values */
  const uniqueStates = [
    'All',
    ...new Set(
      rankings
        .map(e => legislatorsCache[e.name]?.state)
        .filter(Boolean)
        .sort()
    ),
  ]
  const uniqueChambers = ['All', 'House', 'Senate']

  /* filtering & sorting */
  const filtered = rankings.filter(entry => {
    const cached = legislatorsCache[entry.name] || {}
    const stateMatch =
      selectedState === 'All' || cached.state === selectedState
    const chamberMatch =
      selectedChamber === 'All' ||
      (cached.chamber || '').toLowerCase() === selectedChamber.toLowerCase()
    const nameMatch = entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    return stateMatch && chamberMatch && nameMatch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortMetric) return 0
    const aVal =
      sortMetric === 'metascore'
        ? a.metascore ?? 0
        : a.coreScores?.[sortMetric] ?? 0
    const bVal =
      sortMetric === 'metascore'
        ? b.metascore ?? 0
        : b.coreScores?.[sortMetric] ?? 0
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const visibleEntries = sorted.slice(0, visibleCount)

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Progressive Power Rankings – Week of ${week}`}</title>
        <meta name="description" content="Weekly progressive performance metrics" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/rankings`} />
        <meta property="og:title" content={`Progressive Power Rankings – Week of ${week}`} />
        <meta property="og:image" content={`${SITE_URL}/images/default-share.jpg`} />
      </Head>

      {/* header & summary */}
      <div className={styles.header}>
        <div className={styles.fullHeader}>
          <h1 className={styles.title}>Progressive Power Rankings</h1>
          <p className={styles.week}>Week of {week}</p>
          <p className={styles.pageSummary}>
            {typeof summary === 'string'
              ? (showFullSummary ? summary : truncateSummary(summary))
              : showFullSummary
              ? <PortableText value={summary} />
              : truncateSummary(toPlainText(summary))}
          </p>
          <button
            className={styles.expandButtonLarge}
            onClick={() => setShowFullSummary(!showFullSummary)}
          >
            {showFullSummary ? 'Hide Full Summary' : 'Read More'}
          </button>
          <div className={styles.buttonRow}>
            <Link href="/methodology" legacyBehavior>
              <a className={styles.methodologyButton}>📘 View Methodology</a>
            </Link>
            <Link href="/rankings/archive" legacyBehavior>
              <a className={styles.methodologyButton}>📚 View Past Weeks</a>
            </Link>
          </div>
        </div>
      </div>
      {/* filters */}
      <div className={styles.filters}>
        <label htmlFor="stateFilter">Filter by State:</label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          className={styles.dropdown}
        >
          {uniqueStates.map(st => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <label htmlFor="chamberFilter">Filter by Chamber:</label>
        <select
          id="chamberFilter"
          value={selectedChamber}
          onChange={e => setSelectedChamber(e.target.value)}
          className={styles.dropdown}
        >
          {uniqueChambers.map(ch => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>

        <label htmlFor="nameSearch">Search by Name:</label>
        <input
          id="nameSearch"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="e.g. Summer Lee"
          className={styles.searchInput}
        />
      </div>

      {/* sort */}
      <div className={styles.sortFilters}>
        <label htmlFor="sortMetric">Sort Core Scores:</label>
        <select
          id="sortMetric"
          value={sortMetric}
          onChange={e => setSortMetric(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">None</option>
          <option value="weeklyMediaImpact">Media Impact</option>
          <option value="progressiveConsistency">Progressive Consistency</option>
          <option value="legislativePower">Legislative Power</option>
          <option value="ideology">Ideology</option>
          <option value="finance">Donor Ethics</option>
          <option value="metascore">Metascore</option>
        </select>

        <label htmlFor="sortOrder">Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className={styles.dropdown}
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>

      {/* entry list */}
      {visibleEntries.length === 0 ? (
        <p className={styles.noResults}>No Democrats found in this filter combination.</p>
      ) : (
        visibleEntries.map(entry => (
          <RankingCard
            key={entry._key}
            entry={entry}
            legislatorsCache={legislatorsCache}
            bioguideMap={bioguideMap}
          />
        ))
      )}

      {visibleCount < filtered.length && (
        <button
          className={styles.loadMoreButton}
          onClick={() => setVisibleCount(visibleCount + 25)}
        >
          Load More
        </button>
      )}

      {/* share the whole list */}
      <ShareButtons
        url={`${SITE_URL}/rankings`}
        title="Check out this week's Progressive Power Rankings!"
      />
    </div>
  )
}
function RankingCard({ entry, legislatorsCache, bioguideMap }) {
  const [expanded,    setExpanded]    = useState(false)
  const [deepExpanded,setDeepExpanded]= useState(false)

  const {
    name, rank, lastRank, metascore,
    summary, justification,
    coreScores, mediaBreakdown, financeBreakdown,
    legislativeDetails, ideologyRaw, votes,
    bills, citations, photoUrl: cmsPhotoUrl,
  } = entry

  /* resolve headshot path */
  const bioguide =
    legislatorsCache[name]?.bioguide || bioguideMap[name] || null
  const localPhoto =
    bioguide ? `/images/politicians/${bioguide.toUpperCase()}.jpg` : null
  const photoUrl =
    localPhoto || cmsPhotoUrl || '/images/politicians/default-politician.jpg'

  const change = lastRank != null ? lastRank - rank : 0
  const cached = legislatorsCache[name] || {}
  const chamberName = cached.chamber
    ? cached.chamber.charAt(0).toUpperCase() + cached.chamber.slice(1)
    : 'Chamber'

  const shareUrl  = `${SITE_URL}/rankings/${entry._key}`
  const shareText = `${name} scored ${metascore.toFixed(
    2
  )} on the Progressive Power Rankings – See details!`

  return (
    <div className={styles.card} id={name.replace(/\s+/g, '-')}>
      <div className={styles.headerRow}>
        <div className={styles.rank}>{rank}</div>

        <div className={styles.photo}>
          <img
            src={photoUrl}
            alt={`${name} headshot`}
            className={styles.image}
            loading="lazy"
            onError={e => {
              e.currentTarget.src = '/images/politicians/default-politician.jpg'
            }}
          />
        </div>

        <div className={styles.metaBlock}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.chamber}>
            {chamberName}, {cached.state || 'State'} ({cached.party || 'Party'})
          </p>
          <p className={styles.metascore}>Metascore: {metascore.toFixed(2)}</p>
          <p
            className={styles.change}
            style={{ color: change >= 0 ? 'green' : 'red' }}
          >
            {change === 0 ? '—' : change > 0 ? `▲ ${change}` : `▼ ${Math.abs(change)}`}{' '}
            from last week
          </p>

          {/* share icons */}
          <div className={styles.shareSmall}>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/social/PNG/Color/X.png" alt="Share on X" width={24} height={24}/>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/social/PNG/Color/Facebook.png" alt="Share on Facebook" width={24} height={24}/>
            </a>
            <a
              href={`https://reddit.com/submit?url=${encodeURIComponent(
                shareUrl
              )}&title=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/social/PNG/Color/Reddit.png" alt="Share on Reddit" width={24} height={24}/>
            </a>
            <a
              href={`https://bsky.app/intent/compose?text=${encodeURIComponent(
                shareText + ' ' + shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/social/PNG/Color/Bluesky.png" alt="Share on Bluesky" width={24} height={24}/>
            </a>
          </div>
        </div>

        <button
          className={styles.expandButtonLarge}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'See More'}
        </button>
      </div>

      {/* LEVEL ONE */}
      {expanded && (
        <div className={styles.levelOne}>
          <p className={styles.summary}>{summary}</p>
          <h4 className={styles.coreHeader}>⭐ Core Factors</h4>
          <div className={styles.coreScores}>
            <span className={styles.badge}>📰 Media Impact: {coreScores?.weeklyMediaImpact}</span>
            <span className={styles.badge}>🗳️ Progressive Consistency: {coreScores?.progressiveConsistency}</span>
            <span className={styles.badge}>🏛️ Legislative Power: {coreScores?.legislativePower}</span>
            <span className={styles.badge}>🧭 Ideology: {coreScores?.ideology}</span>
            <span className={styles.badge}>💰 Donor Ethics: {coreScores?.finance}</span>
          </div>
          <button
            className={styles.expandButtonLarge}
            onClick={() => setDeepExpanded(!deepExpanded)}
          >
            {deepExpanded ? 'Hide Breakdown' : 'See Full Breakdown'}
          </button>
        </div>
      )}
      {/* LEVEL TWO */}
      {deepExpanded && (
        <div className={styles.levelTwo}>
          {justification && (
            <>
              <h4 className={styles.sectionTitle}>🧠 <strong>Weekly News Summary</strong></h4>
              <div className={styles.paragraph}>
                <PortableText value={justification} />
              </div>
            </>
          )}

          <h4 className={styles.sectionTitle}>📰 <strong>Media Impact Breakdown</strong></h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Policy:</strong> {mediaBreakdown?.policyImpact}</li>
            <li className={styles.badge}><strong>Perception:</strong> {mediaBreakdown?.publicPerception}</li>
            <li className={styles.badge}><strong>Controversy:</strong> {mediaBreakdown?.controversy}</li>
            <li className={styles.badge}><strong>Clout:</strong> {mediaBreakdown?.mediaClout}</li>
          </ul>

          <h4 className={styles.sectionTitle}>🗳️ <strong>Progressive Voting Consistency via ProgressivePunch.org</strong></h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Crucial (Lifetime):</strong> {votes?.crucialLifetime ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Crucial (Current):</strong> {votes?.crucialCurrent ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Overall (Lifetime):</strong> {votes?.overallLifetime ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Overall (Current):</strong> {votes?.overallCurrent ?? 'N/A'}%</li>
          </ul>

          <h4 className={styles.sectionTitle}>💰 <strong>Top 3 Donor Industries via OpenSecrets.org</strong></h4>
          {financeBreakdown?.length > 0 ? (
            <ul className={styles.badgeList}>
              {financeBreakdown.map(f => (
                <li key={f._key} className={styles.badge}>{f.industry}</li>
              ))}
            </ul>
          ) : <p className={styles.paragraph}>No donor data available.</p>}

          <h4 className={styles.sectionTitle}>🧭 <strong>Ideology</strong></h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Raw Score:</strong> {ideologyRaw}</li>
          </ul>

          <h4 className={styles.sectionTitle}>🏛️ <strong>Legislative Data via Congress.gov</strong></h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Tenure:</strong> {legislativeDetails?.tenure} years</li>
          </ul>
          {legislativeDetails?.committeeMemberships?.length > 0 && (
            <>
              <p className={styles.paragraph}><strong>Committee Memberships:</strong></p>
              <ul className={styles.badgeList}>
                {legislativeDetails.committeeMemberships.map((c,i) => (
                  <li key={`cm-${i}`} className={styles.badge}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {legislativeDetails?.committeeLeaderships?.length > 0 && (
            <>
              <p className={styles.paragraph}><strong>Leadership Roles:</strong></p>
              <ul className={styles.badgeList}>
                {legislativeDetails.committeeLeaderships.map((c,i) => (
                  <li key={`cl-${i}`} className={styles.badge}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {bills?.length > 0 && (
            <>
              <h4 className={styles.sectionTitle}>📜 <strong>Sponsored Bills</strong></h4>
              <ul className={styles.billList}>
                {bills.map(bill => (
                  <li key={bill._key} className={styles.billItem}>
                    <a href={bill.url} className={styles.billLink} target="_blank" rel="noopener noreferrer">
                      {bill.billNumber}: {bill.title}
                    </a>
                    <p className={styles.billMeta}>
                      <strong>Keyword:</strong> {bill.policyKeyword} | <strong>Score:</strong> {bill.progressiveScore} | <strong>Date:</strong> {bill.statusDate}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {citations?.length > 0 && (
            <>
              <h4 className={styles.sectionTitle}>🔗 <strong>News Citations</strong></h4>
              <ul className={styles.citationList}>
                {citations.map(c => (
                  <li key={c._key} className={styles.citationItem}>
                    <a href={c.url} className={styles.citationLink} target="_blank" rel="noopener noreferrer">
                      {c.title} ({c.source}, {new Date(c.published).toLocaleDateString()})
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
