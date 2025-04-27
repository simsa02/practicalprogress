// pages/rankings/week/[id].js

import { useState, useMemo } from 'react'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import styles from '../../../styles/PowerRankings.module.css'
import legislatorsCache from '../../../data/legislators_cache.json'

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

const weekQuery = groq`
  *[_type == "weeklyPowerRanking" && _id == $id][0]{
    _id,
    week,
    weekTitle,
    summary,
    entries[] {
      _key,
      name,
      rank,
      lastRank,
      photoUrl,
      metascore,
      summary,
      coreScores {
        weeklyMediaImpact,
        progressiveConsistency,
        legislativePower,
        ideology,
        finance
      },
      justification,
      mediaBreakdown {
        policyImpact,
        publicPerception,
        controversy,
        mediaClout
      },
      votes {
        crucialLifetime,
        crucialCurrent,
        overallLifetime,
        overallCurrent
      },
      financeBreakdown[] {
        _key,
        industry
      },
      ideologyRaw,
      legislativeDetails {
        tenure,
        committeeMemberships,
        committeeLeaderships
      },
      bills[] {
        _key,
        billNumber,
        title,
        policyKeyword,
        progressiveScore,
        statusDate,
        url
      },
      citations[] {
        _key,
        title,
        source,
        url,
        published
      }
    }
  }
`

export async function getStaticPaths() {
  const weeks = await client.fetch(groq`*[_type == "weeklyPowerRanking"]{ _id }`)
  return {
    paths: weeks.map(week => ({ params: { id: week._id } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const week = await client.fetch(weekQuery, { id: params.id })
  if (!week) return { notFound: true }
  return {
    props: { week },
    revalidate: 60,
  }
}

export default function WeeklyRankingPage({ week }) {
  const [expandedEntry, setExpandedEntry] = useState(null)
  const [sortMetric, setSortMetric] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [selectedChamber, setSelectedChamber] = useState('All')

  const uniqueStates = useMemo(() => {
    const allStates = week.entries.map(e => legislatorsCache[e.name]?.state).filter(Boolean)
    return ['All', ...Array.from(new Set(allStates)).sort()]
  }, [week.entries])

  const uniqueChambers = useMemo(() => {
    const allChambers = week.entries.map(e => legislatorsCache[e.name]?.chamber).filter(Boolean)
    return ['All', ...Array.from(new Set(allChambers)).sort()]
  }, [week.entries])

  const filteredEntries = useMemo(() => {
    return week.entries.filter(e => {
      const nameMatch = e.name.toLowerCase().includes(searchTerm.toLowerCase())
      const stateMatch = selectedState === 'All' || legislatorsCache[e.name]?.state === selectedState
      const chamberMatch = selectedChamber === 'All' || legislatorsCache[e.name]?.chamber === selectedChamber
      return nameMatch && stateMatch && chamberMatch
    })
  }, [week.entries, searchTerm, selectedState, selectedChamber])

  const sortedEntries = useMemo(() => {
    const list = [...filteredEntries]
    if (sortMetric) {
      list.sort((a, b) => {
        const aScore = a.coreScores?.[sortMetric] ?? a[sortMetric] ?? 0
        const bScore = b.coreScores?.[sortMetric] ?? b[sortMetric] ?? 0
        return sortOrder === 'desc' ? bScore - aScore : aScore - bScore
      })
    } else {
      list.sort((a, b) => a.rank - b.rank)
    }
    return list
  }, [filteredEntries, sortMetric, sortOrder])

  return (
    <div className={styles.container}>
      <Head>
        <title>{week.weekTitle} – Practical Progress Power Rankings</title>
        <meta name="description" content={`Full rankings for ${week.weekTitle}`} />
      </Head>

      <div className={styles.buttonGroup}>
        <Link href="/rankings/archive" className={styles.expandButtonLarge}>
          ← Back to Archive
        </Link><div></div>
        <Link href="/rankings" className={styles.expandButtonLarge}>
          ← Back to Current Rankings
        </Link>
      </div>

      <h1 className={styles.title}>
        {week.weekTitle || `Week of ${new Date(week.week).toLocaleDateString()}`}
      </h1>

      <div className={styles.pageSummary}>
        <PortableText value={week.summary} />
      </div>

      <div className={styles.filters}>
        <label htmlFor="stateFilter">Filter by State:</label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          className={styles.dropdown}
        >
          {uniqueStates.map(state => (
            <option key={state} value={state}>
              {state}
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
          {uniqueChambers.map(chamber => (
            <option key={chamber} value={chamber}>
              {chamber}
            </option>
          ))}
        </select>

        <label htmlFor="nameSearch">Search by Name:</label>
        <input
          id="nameSearch"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="e.g. Summer Lee"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.sortFilters}>
        <label htmlFor="sortMetric">Sort Core Scores:</label>
        <select
          id="sortMetric"
          value={sortMetric}
          onChange={e => setSortMetric(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Rank (Default)</option>
          <option value="weeklyMediaImpact">Media Impact</option>
          <option value="progressiveConsistency">Progressive Consistency</option>
          <option value="legislativePower">Legislative Power</option>
          <option value="ideology">Ideology</option>
          <option value="finance">Donor Ethics</option>
          <option value="metascore">Metascore</option>
        </select>

        <label htmlFor="sortOrder">Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className={styles.dropdown}
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>

      <div className={styles.grid}>
      {sortedEntries.length === 0 ? (
          <p className={styles.noResults}>
            No results for this filter combination.
          </p>
        ) : (
          sortedEntries.map((entry) => {
            const bioguide = legislatorsCache[entry.name]?.bioguide || null
            const localPhoto = bioguide
              ? `/images/politicians/${bioguide.toUpperCase()}.jpg`
              : null
            const photoSrc = localPhoto || entry.photoUrl || '/images/politicians/default-politician.jpg'

            const delta = entry.lastRank != null ? entry.lastRank - entry.rank : 0
            const deltaText = delta === 0 ? '—' : delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`

            return (
              <div key={entry._key} className={styles.card}>
                <div className={styles.rankBadge}>{entry.rank}</div>

                <div className={styles.photo}>
                  <Image
                    src={photoSrc}
                    alt={entry.name}
                    width={100}
                    height={100}
                    className={styles.image}
                    onError={({ currentTarget }) => {
                      currentTarget.src = '/images/politicians/default-politician.jpg'
                    }}
                  />
                </div>

                <div className={styles.metaBlock}>
                  <h2 className={styles.name}>{entry.name}</h2>

                  <p className={styles.metascore}>
                    Metascore: {entry.metascore?.toFixed(2) ?? 'N/A'}
                  </p>

                  <p
                    className={styles.change}
                    style={{ color: delta > 0 ? 'green' : delta < 0 ? 'red' : 'black' }}
                  >
                    {deltaText} from last week
                  </p>

                  <div className={styles.coreScores}>
                    <span className={styles.badge}>
                      📰 Media Impact: {entry.coreScores?.weeklyMediaImpact ?? 'N/A'}
                    </span>
                    <span className={styles.badge}>
                      🗳️ Progressive Consistency: {entry.coreScores?.progressiveConsistency ?? 'N/A'}
                    </span>
                    <span className={styles.badge}>
                      🏛️ Legislative Power: {entry.coreScores?.legislativePower ?? 'N/A'}
                    </span>
                    <span className={styles.badge}>
                      🧭 Ideology: {entry.coreScores?.ideology ?? 'N/A'}
                    </span>
                    <span className={styles.badge}>
                      💰 Donor Ethics: {entry.coreScores?.finance ?? 'N/A'}
                    </span>
                  </div>

                  <button
                    className={styles.expandButton}
                    onClick={() => setExpandedEntry(expandedEntry === entry._key ? null : entry._key)}
                  >
                    {expandedEntry === entry._key ? 'Collapse' : 'Expand'}
                  </button>

                  {expandedEntry === entry._key && (
                    <div className={styles.expandedSection}>
                      {entry.summary && (
                        <p className={styles.summary}>{entry.summary}</p>
                      )}

                      {entry.financeBreakdown?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4>Top Donor Industries</h4>
                          <ul className={styles.badgeList}>
                            {entry.financeBreakdown.map((f) => (
                              <li key={f._key} className={styles.badge}>
                                {f.industry}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.votes && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4>Voting Consistency</h4>
                          <ul className={styles.badgeList}>
                            <li className={styles.badge}>
                              Crucial Lifetime: {entry.votes.crucialLifetime ?? 'N/A'}%
                            </li>
                            <li className={styles.badge}>
                              Crucial Current: {entry.votes.crucialCurrent ?? 'N/A'}%
                            </li>
                            <li className={styles.badge}>
                              Overall Lifetime: {entry.votes.overallLifetime ?? 'N/A'}%
                            </li>
                            <li className={styles.badge}>
                              Overall Current: {entry.votes.overallCurrent ?? 'N/A'}%
                            </li>
                          </ul>
                        </div>
                      )}

                      <div style={{ marginTop: '1rem' }}>
                        <Link href={`/rankings/${entry._key}`} className={styles.expandButtonLarge}>
                          See Full Profile →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href="/rankings/archive" className={styles.expandButtonLarge}>
          ← Back to Archive
        </Link>
      </div>
    </div>
  )
}
