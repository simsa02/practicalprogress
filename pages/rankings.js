import fs from 'fs'
import path from 'path'
import Head from 'next/head'
import { useState, useMemo } from 'react'
import styles from '../styles/PowerRankings.module.css'
import { groq } from 'next-sanity'
import sanityClient from '../lib/sanity/sanity'
import { PortableText } from '@portabletext/react'

// Helper: Convert string to title case.
const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )

// Utility: Generate social share URLs.
const generateShareUrls = (pageUrl, title) => ({
  reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(
    pageUrl
  )}&title=${encodeURIComponent(title)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(pageUrl)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}`,
  instagram: `#`,
  tiktok: `#`
})

// Helper: Emoji display for Media Impact.
const getMediaImpactDisplay = (score) => {
  if (!score || score === 0) return "🤷‍♂️"
  if (score < 50) return `🤔 ${score.toFixed(2)}`
  if (score < 75) return `👌 ${score.toFixed(2)}`
  return `🔥 ${score.toFixed(2)}`
}

// Helper: Emoji display for Legislate Floor.
const getLegislateFloorDisplay = (score) => {
  if (!score || score === 0) return "No Major Change"
  if (score < 50) return `⚖️ ${score.toFixed(2)}`
  if (score < 75) return `👍 ${score.toFixed(2)}`
  return `💪 ${score.toFixed(2)}`
}

// Generate a politician's headshot URL using the legislator cache.
const getCongressPhotoUrl = (name, legislatorsCache, size = "225x275") => {
  if (
    legislatorsCache &&
    legislatorsCache[name] &&
    legislatorsCache[name].bioguide
  ) {
    return `https://unitedstates.github.io/images/congress/${size}/${legislatorsCache[name].bioguide}.jpg`
  }
  return "/images/politicians/default-politician.jpg"
}

// Retrieve legislator details from cache.
const getLegislatorDetails = (name, legislatorsCache) => {
  if (legislatorsCache && legislatorsCache[name]) {
    const { state, party, chamber } = legislatorsCache[name]
    return `${state.toUpperCase()} | ${toTitleCase(party)} | ${toTitleCase(chamber)}`
  }
  return ""
}

/**
 * Helper functions for normalizing Portable Text.
 * If the value is a plain string (with paragraph breaks),
 * convert it into an array of block objects.
 */
function generateKey() {
  // In modern browsers, crypto.randomUUID() is available.
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2)
}

function normalizePortableText(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Split on double newlines (paragraph breaks)
    const paragraphs = value.split(/\n\s*\n/).filter((para) => para.trim().length > 0)
    return paragraphs.map((para) => ({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: generateKey(),
          text: para,
          marks: []
        }
      ]
    }))
  }
  return []
}

export async function getStaticProps() {
  // Fetch power ranking documents from Sanity.
  const rankingsQuery = groq`*[_type == "powerRanking"] | order(week desc, rank asc)`
  const rankings = await sanityClient.fetch(rankingsQuery)

  // Fetch weekly meta info from Sanity via a "powerRankingWeek" document.
  const metaQuery = groq`*[_type == "powerRankingWeek"] | order(weekDate desc)[0]`
  const meta = await sanityClient.fetch(metaQuery)
  const week = meta?.weekDate || null
  // Ensure meta summary is normalized: if it's a string, convert to an array of blocks.
  const summary =
    meta?.summary && Array.isArray(meta.summary)
      ? meta.summary
      : normalizePortableText(meta?.summary || "")

  // Fetch the Score Explanation document from Sanity.
  const scoreExplanationQuery = groq`*[_type == "scoreExplanation"][0]`
  const scoreExplanation = await sanityClient.fetch(scoreExplanationQuery)

  // Load legislators cache from the local file system.
  const cachePath = path.join(process.cwd(), "legislators_cache.json")
  let legislatorsCache = {}
  try {
    const rawCache = fs.readFileSync(cachePath, "utf-8")
    legislatorsCache = JSON.parse(rawCache)
  } catch (err) {
    console.error("Error loading legislators cache:", err)
  }

  return {
    props: { rankings, week, summary, scoreExplanation, legislatorsCache },
    revalidate: 60
  }
}

export default function Rankings({ rankings, week, summary, scoreExplanation, legislatorsCache }) {
  const [expanded, setExpanded] = useState(null)
  const [filterText, setFilterText] = useState("")
  const [selectedChamber, setSelectedChamber] = useState("All")
  const [selectedState, setSelectedState] = useState("All")
  const [summaryExpanded, setSummaryExpanded] = useState(false) // For weekly summary toggle

  // Toggle for each politician container.
  const toggle = (id) => setExpanded(expanded === id ? null : id)
  // Toggle for weekly summary.
  const toggleSummary = () => setSummaryExpanded(!summaryExpanded)

  // Build available filter options.
  const availableChambers = useMemo(() => {
    const chambers = new Set()
    rankings.forEach((p) => {
      if (legislatorsCache && legislatorsCache[p.name] && legislatorsCache[p.name].chamber) {
        chambers.add(toTitleCase(legislatorsCache[p.name].chamber))
      }
    })
    return ["All", ...Array.from(chambers).sort()]
  }, [rankings, legislatorsCache])

  const availableStates = useMemo(() => {
    const states = new Set()
    rankings.forEach((p) => {
      if (legislatorsCache && legislatorsCache[p.name] && legislatorsCache[p.name].state) {
        states.add(legislatorsCache[p.name].state.toUpperCase())
      }
    })
    return ["All", ...Array.from(states).sort()]
  }, [rankings, legislatorsCache])

  // Filter rankings.
  const filteredRankings = useMemo(() => {
    let filtered = rankings.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase())
    )
    if (selectedChamber !== "All") {
      filtered = filtered.filter((p) => {
        if (legislatorsCache && legislatorsCache[p.name] && legislatorsCache[p.name].chamber) {
          return toTitleCase(legislatorsCache[p.name].chamber) === selectedChamber
        }
        return false
      })
    }
    if (selectedState !== "All") {
      filtered = filtered.filter((p) => {
        if (legislatorsCache && legislatorsCache[p.name] && legislatorsCache[p.name].state) {
          return legislatorsCache[p.name].state.toUpperCase() === selectedState
        }
        return false
      })
    }
    // Sort by score descending (if available), otherwise by rank.
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0))
    return filtered
  }, [rankings, filterText, selectedChamber, selectedState, legislatorsCache])

  // Social share URLs.
  const pageUrl = "http://localhost:3000/rankings" // Update for production.
  const pageTitle = `Progressive Power Rankings – Week ${
    week ? new Date(week).toLocaleDateString() : "N/A"
  }`
  const shareUrls = generateShareUrls(pageUrl, pageTitle)

  return (
    <div className={styles.container}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Professional Progressive Power Rankings" />
      </Head>

      {/* Top Social Share Bar */}
      <div className={styles.shareBar}>
        <a href={shareUrls.reddit} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Reddit.png" alt="Share on Reddit" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.x} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/x.png" alt="Share on X" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Facebook.png" alt="Share on Facebook" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.instagram} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Instagram.png" alt="Share on Instagram" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.tiktok} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Tik Tok.png" alt="Share on TikTok" className={styles.shareIcon} />
        </a>
      </div>

      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Progressive Power Rankings</h1>
        <p className={styles.weekText}>Week {week ? new Date(week).toLocaleDateString() : "N/A"}</p>
        {/* Weekly summary with its own toggle */}
        <div className={`${styles.summaryContainer} ${summaryExpanded ? styles.expanded : ''}`}>
          <PortableText value={Array.isArray(summary) ? summary : normalizePortableText(summary)} />
        </div>
        <div className={styles.summaryToggleContainer}>
          <button className={styles.summaryToggleButton} onClick={toggleSummary}>
            {summaryExpanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className={styles.filterInput}
        />
        <select
          value={selectedChamber}
          onChange={(e) => setSelectedChamber(e.target.value)}
          className={styles.sortSelect}
        >
          {availableChambers.map((chamber) => (
            <option key={chamber} value={chamber}>
              {chamber}
            </option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className={styles.sortSelect}
        >
          {availableStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <main className={styles.main}>
        <div className={styles.tableWrapper}>
          {/* Table header */}
          <div className={styles.tableHeader}>
            <div className={styles.cellRank}>Rank</div>
            <div className={styles.cellPhoto}>Photo</div>
            <div className={styles.cellMetascore}>Metascore</div>
            <div className={styles.cellWeekly}>Weekly Change</div>
            <div className={styles.cellBaseline}>Baseline Score</div>
            <div className={styles.cellNews}>Media Impact</div>
            <div className={styles.cellLegislation}>Legislative Floor</div>
          </div>
          {/* Ranking rows */}
          {filteredRankings.length > 0 ? (
            filteredRankings.map((p) => (
              <div key={p._id} className={styles.rankingRow} onClick={() => toggle(p._id)}>
                <div className={styles.row}>
                  <div className={styles.cellRank}>#{p.rank}</div>
                  <div className={styles.cellPhoto}>
                    <img
                      src={getCongressPhotoUrl(p.name, legislatorsCache, "225x275")}
                      alt={`Headshot of ${p.name}`}
                      className={styles.photo}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/images/politicians/default-politician.jpg"
                      }}
                    />
                    <div className={styles.nameUnderPhoto}>{p.name}</div>
                    <div className={styles.legislatorDetails}>
                      {getLegislatorDetails(p.name, legislatorsCache)}
                    </div>
                  </div>
                  <div className={styles.cellMetascore}>
                    {p.score ? p.score.toFixed(2) : '-'}
                  </div>
                  <div className={styles.cellWeekly}>
                    {p.weekly_change && p.weekly_change !== 0 ? p.weekly_change.toFixed(2) : "-"}
                  </div>
                  <div className={styles.cellBaseline}>
                    {p.baseline_score ? p.baseline_score.toFixed(2) : '-'}
                  </div>
                  <div className={styles.cellNews}>
                    {getMediaImpactDisplay(p.news_score)}
                  </div>
                  <div className={styles.cellLegislation}>
                    {getLegislateFloorDisplay(p.legislation_score)}
                  </div>
                </div>
                {/* "Read More" toggle centered just above the break */}
                <div className={styles.readMoreContainer}>
                  <button
                    className={styles.readMoreButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(p._id)
                    }}
                  >
                    {expanded === p._id ? "Hide" : "Read More"}
                  </button>
                </div>
                {expanded === p._id && (
                  <div className={styles.expandedRow}>
                    <div className={styles.expandedSummary}>
                      {p.summary ? (
                        <PortableText
                          value={
                            Array.isArray(p.summary)
                              ? p.summary
                              : normalizePortableText(p.summary)
                          }
                        />
                      ) : (
                        "No individual summary available."
                      )}
                    </div>
                    <h4 className={styles.expandedHeading}>Media Impact Breakdown</h4>
                    <div className={styles.scoreBoxes}>
                      <div className={styles.scoreBox}>
                        <span>Policy Impact</span>
                        <span>{p.policy_impact || 75}</span>
                      </div>
                      <div className={styles.scoreBox}>
                        <span>Public Perception</span>
                        <span>{p.public_perception || 60}</span>
                      </div>
                      <div className={styles.scoreBox}>
                        <span>Controversy</span>
                        <span>{p.controversy || 85}</span>
                      </div>
                      <div className={styles.scoreBox}>
                        <span>Media Clout</span>
                        <span>{p.media_clout || 70}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No results match your filters.</div>
          )}
        </div>
      </main>

      {/* "How the Score Works" Section from Sanity */}
      {scoreExplanation?.content && (
        <section className={styles.scoreExplanation}>
          <PortableText value={scoreExplanation.content} />
        </section>
      )}

      {/* Bottom Social Share Bar */}
      <section className={styles.extraSection}>
        <h2 className={styles.extraTitle}>Connect &amp; Share</h2>
        <p className={styles.extraText}>
          Stay informed, join the conversation, and share these rankings with your network.
        </p>
        <div className={styles.extraShare}>
          <a href={shareUrls.reddit} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
            <img src="/images/social/PNG/Color/Reddit.png" alt="Share on Reddit" className={styles.shareIcon} />
          </a>
          <a href={shareUrls.x} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
            <img src="/images/social/PNG/Color/x.png" alt="Share on X" className={styles.shareIcon} />
          </a>
          <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
            <img src="/images/social/PNG/Color/Facebook.png" alt="Share on Facebook" className={styles.shareIcon} />
          </a>
          <a href={shareUrls.instagram} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
            <img src="/images/social/PNG/Color/Instagram.png" alt="Share on Instagram" className={styles.shareIcon} />
          </a>
          <a href={shareUrls.tiktok} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
            <img src="/images/social/PNG/Color/Tik Tok.png" alt="Share on TikTok" className={styles.shareIcon} />
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Progressive Power Rankings. All rights reserved.</p>
      </footer>
    </div>
  )
}
