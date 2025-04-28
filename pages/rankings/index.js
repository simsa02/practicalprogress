import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { createClient, groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import fs from 'fs';
import fsExtra from 'fs-extra';
import yaml from 'js-yaml';
import Fuse from 'fuse.js';
import path from 'path';
import styles from '../../styles/PowerRankings.module.css';
import ShareButtons from '../../components/ShareButtons';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

const query = groq`
  *[_type == "weeklyPowerRanking"]
    | order(week desc)[0] {
      week,
      summary,
      entries[] {
        _key,
        name,
        photoUrl,
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
        bills[] {
          _key,
          billNumber,
          title,
          url,
          policyKeyword,
          progressiveScore,
          statusDate
        },
        citations[] {
          _key,
          title,
          url,
          source,
          published
        }
      }
    }
`;

export async function getStaticProps() {
  const data = await client.fetch(query);
  const cachePath = path.join(process.cwd(), 'legislators_cache.json');
  const yamlPath = path.join(process.cwd(), 'legislators-current.yaml');

  let legislatorsCache = {};
  let yamlData = [];

  try {
    legislatorsCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } catch {
    console.error('Could not load legislator cache.');
  }

  try {
    yamlData = yaml.load(fsExtra.readFileSync(yamlPath, 'utf-8'));
  } catch {
    console.error('Could not load YAML data.');
  }

  const fuse = new Fuse(yamlData, {
    keys: ['name.official_full'],
    threshold: 0.3,
    distance: 100,
  });

  const bioguideMap = {};
  (data.entries || []).forEach(entry => {
    const result = fuse.search(entry.name);
    if (result.length > 0) {
      bioguideMap[entry.name] = result[0].item.id?.bioguide || null;
    }
  });

  if (!data?.entries) {
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

const truncatePortableText = blocks => {
  if (!Array.isArray(blocks)) return blocks;
  // Take only the first block and limit its content
  return [{
    ...blocks[0],
    children: blocks[0].children.map(child => ({
      ...child,
      text: child.text.length > 200 ? `${child.text.substring(0, 200)}...` : child.text
    }))
  }];
};
const milestoneMessages = {
  5: ["🎯 Off to a great start!", "📰 You've scratched the surface!"],
  10: ["📈 10% explored — you're ahead of the pack!", "🧠 Great momentum — dive deeper."],
  20: ["🔥 20% through. Who's standing out to you?"],
  25: ["🏆 25% milestone — you're serious about progress."],
  50: ["🚀 Halfway there. Real patterns are emerging."],
  75: ["🏆 75% — elite reader status."],
  100: ["🎉 100% — You explored it all. That's commitment."]
};

const expansionMessages = [
  "🔎 You're digging deep! Keep uncovering the details.",
  "🧠 Smart move opening breakdowns. Power is in the details."
];

const sortFilterMessages = [
  "📊 Sorting like a strategist!",
  "🗳️ Chamber filtering: smart tactical move!",
  "🧭 Following ideology — true north thinking."
];

const randomMilestones = {
  3: ["🌱 Early start — roots of change."],
  7: ["🎯 Warming up. Smart readers don't rush."],
  13: ["📰 Already deeper than most voters."],
  69: ["😎 69%? Nice. And important."]
};

const rareSurpriseMessages = [
  "🌈 Ultra rare! True progress requires patience.",
  "🎩 Hidden gem unlocked — you're seeing deeper!"
];

const metaAchievementMessages = {
  5:  "🛫 Opened 5 profiles — starting strong!",
  10: "✈️ 10 dives in — building momentum!",
  20: "🚀 20+ expansions — orbital researcher!",
  30: "🌎 30+ — global awareness unlocked!"
};

const politicianMessages = {
  "Alexandria Ocasio-Cortez": [
    "🔥 AOC: Always center stage.",
    "🗣️ You clicked AOC — bold ideas demand bold action."
  ],
  "Bernie Sanders": [
    "🧓 Bernie: elder statesman of progressives!",
    "📚 Learning from the movement's roots."
  ],
  "Summer Lee": [
    "🌟 Rising star! Summer Lee is just getting started."
  ],
  "Adam Schiff": [
    "🕵️‍♂️ Investigation king. You clicked Schiff."
  ]
};
export default function PowerRankings({ rankings, week, summary, legislatorsCache, bioguideMap }) {
  const [selectedState, setSelectedState]       = useState('All');
  const [selectedChamber, setSelectedChamber]   = useState('All');
  const [searchTerm, setSearchTerm]             = useState('');
  const [visibleCount, setVisibleCount]         = useState(25);
  const [showFullSummary, setShowFullSummary]   = useState(false);
  const [sortMetric, setSortMetric]             = useState('');
  const [sortOrder, setSortOrder]               = useState('desc');
  const [scrollProgress, setScrollProgress]     = useState(0);
  const [milestonesHit, setMilestonesHit]       = useState({});
  const [easterEggMessage, setEasterEggMessage] = useState('');

  // Master Easter-Egg trigger
  const triggerEasterEgg = (type, value) => {
    let msg = '';
    if (type === 'milestone' && milestoneMessages[value]) {
      const opts = milestoneMessages[value];
      msg = opts[Math.floor(Math.random()*opts.length)];
    }
    if (type === 'expansion') {
      msg = expansionMessages[Math.floor(Math.random()*expansionMessages.length)];
    }
    if ((type==='sort'||type==='filter') && sortFilterMessages) {
      msg = sortFilterMessages[Math.floor(Math.random()*sortFilterMessages.length)];
    }
    if (type==='random' && randomMilestones[value]) {
      const opts = randomMilestones[value];
      msg = opts[Math.floor(Math.random()*opts.length)];
    }
    if (type==='rare' && Math.random()<0.01) {
      const opts = rareSurpriseMessages;
      msg = opts[Math.floor(Math.random()*opts.length)];
    }
    if (type==='meta' && metaAchievementMessages[value]) {
      msg = metaAchievementMessages[value];
    }
    if (type==='politician' && politicianMessages[value]) {
      const opts = politicianMessages[value];
      msg = opts[Math.floor(Math.random()*opts.length)];
    }
    if (msg) {
      setEasterEggMessage(msg);
      setTimeout(()=>setEasterEggMessage(''), 5000);
    }
  };

  // Scroll-tracking & milestones
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const dh  = document.body.scrollHeight - window.innerHeight;
      const pct = (top/dh)*100;
      setScrollProgress(pct);

      const total = rankings.length;
      const viewd = Math.min(visibleCount, total);
      const pctv  = (viewd/total)*100;

      const checkMs = m => {
        if (!milestonesHit[m] && pctv>=m) {
          triggerEasterEgg('milestone', m);
          setMilestonesHit(prev=>({ ...prev, [m]:true }));
          if (m===100) {
            import('canvas-confetti')
              .then(c=>c.default({ particleCount:150, spread:80, origin:{ y:0.6 } }))
              .catch(()=>console.error('Confetti failed'));
          }
        }
      };

      Object.keys(milestoneMessages).forEach(k=>checkMs(+k));
      Object.keys(randomMilestones).forEach(k=>checkMs(+k));
      if (Math.random()<0.01) triggerEasterEgg('rare');
    };

    window.addEventListener('scroll', onScroll);
    return ()=>window.removeEventListener('scroll', onScroll);
  }, [visibleCount, milestonesHit, rankings.length]);
  // Prepare filtering & sorting
  const uniqueStates   = ['All', ...new Set(rankings.map(e=>legislatorsCache[e.name]?.state).filter(Boolean).sort())];
  const uniqueChambers = ['All','House','Senate'];

  const filtered = rankings.filter(e=>{
    const c=e.name&&legislatorsCache[e.name]||{};
    return (selectedState==='All'||c.state===selectedState)
        && (selectedChamber==='All'||c.chamber?.toLowerCase()===selectedChamber.toLowerCase())
        && e.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sorted = filtered.slice().sort((a,b)=>{
    if (!sortMetric) return 0;
    const aV = sortMetric==='metascore'?a.metascore||0:a.coreScores?.[sortMetric]||0;
    const bV = sortMetric==='metascore'?b.metascore||0:b.coreScores?.[sortMetric]||0;
    return sortOrder==='desc'?bV-aV:aV-bV;
  });

  const visibleEntries = sorted.slice(0, visibleCount);

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div style={{
        position:'fixed', top:0,left:0,height:'4px',
        width:`${scrollProgress}%`,
        backgroundColor: scrollProgress<50? '#3B82F6': scrollProgress<90? '#10B981':'#F59E0B',
        zIndex:9999, transition:'width 0.25s ease-out'
      }}/>
      <Head>
        <title>{`Practical Progress Power Rankings – Week of ${week}`}</title>
        <meta name="description" content="Weekly rankings of progressive political performance metrics."/>
      </Head>

     {/* Header & Summary */}
<div className={styles.header}>
  <div className={styles.fullHeader}>
    <h1 className={styles.title}>Practical Progress Power Rankings</h1>
    <p className={styles.week}>Week of {week}</p>

    <div className={styles.pageSummary}>
      {typeof summary === 'string' ? (
        <p>{showFullSummary ? summary : truncateSummary(summary)}</p>
      ) : summary ? (
        showFullSummary ? <PortableText value={summary} /> : <PortableText value={truncatePortableText(summary)} />
      ) : null}
    </div>

    <button
      className={styles.expandButtonLarge}
      onClick={() => setShowFullSummary(!showFullSummary)}
    >
      {showFullSummary ? 'Hide Full Summary' : 'Read More'}
    </button>

    {/* BUTTON ROW */}
    <div className={styles.buttonRow}>
      <a
        href="https://sibforms.com/serve/MUIFAGOhMLLlaeq4EfjiGDoC4EE6cPQAicXVOdGejA07xrcJRt4r2bJSuXeAcWh_vYZTM0ASarkaItDQSRMmgxBUwXIPBIa7s8jeM9Sxw-MzBiPP4gh91R4C83m_vco-0ybQLgJnW9rZMqRh5Fy2ocfg0rW8RuF5wygOJW95CRqEWhKWTP8lwDeS4fAHrfnYIioGopehOegezSq1"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.methodologyButton}
      >
        🔔 Subscribe
      </a>

      <Link href="/methodology" legacyBehavior>
        <a className={styles.methodologyButton}>📘 Methodology</a>
      </Link>

      <Link href="/rankings/archive" legacyBehavior>
        <a className={styles.methodologyButton}>📚 Past Weeks</a>
      </Link>
    </div>
  </div>
</div>
      {/* Filters */}
      <div className={styles.filters}>
        <label>State:</label>
        <select value={selectedState}
                onChange={e=>{setSelectedState(e.target.value);triggerEasterEgg('filter');}}
                className={styles.dropdown}>
          {uniqueStates.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <label>Chamber:</label>
        <select value={selectedChamber}
                onChange={e=>{setSelectedChamber(e.target.value);triggerEasterEgg('filter');}}
                className={styles.dropdown}>
          {uniqueChambers.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <label>Search:</label>
        <input type="text" value={searchTerm}
               onChange={e=>setSearchTerm(e.target.value)}
               placeholder="e.g. Summer Lee"
               className={styles.searchInput}/>
      </div>

      {/* Sorters */}
      <div className={styles.sortFilters}>
        <label>Sort By:</label>
        <select value={sortMetric}
                onChange={e=>{setSortMetric(e.target.value);triggerEasterEgg('sort');}}
                className={styles.dropdown}>
          <option value="">None</option>
          <option value="weeklyMediaImpact">Media Impact</option>
          <option value="progressiveConsistency">Progressive Consistency</option>
          <option value="legislativePower">Legislative Power</option>
          <option value="ideology">Ideology</option>
          <option value="finance">Donor Ethics</option>
          <option value="metascore">Metascore</option>
        </select>
        <label>Order:</label>
        <select value={sortOrder}
                onChange={e=>{setSortOrder(e.target.value);triggerEasterEgg('sort');}}
                className={styles.dropdown}>
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>

      {/* Entries */}
      {visibleEntries.length===0
        ? <p className={styles.noResults}>No results for this filter combination.</p>
        : visibleEntries.map(entry=>(
            <RankingCard
              key={entry._key}
              entry={entry}
              legislatorsCache={legislatorsCache}
              bioguideMap={bioguideMap}
              triggerEasterEgg={triggerEasterEgg}
            />
          ))
      }

      {/* Load More */}
      {visibleEntries.length<sorted.length && (
        <button className={styles.loadMoreButton}
                onClick={()=>{
                  setVisibleCount(visibleCount+25);
                  triggerEasterEgg('meta', visibleCount+25);
                }}>
          🚀 Load More Rankings
        </button>
      )}
      {/* Subscription */}
<div className={styles.subscriptionBox}>
  <h2 className={styles.subscriptionTitle}>📬 Get Weekly Rankings</h2>

  <a
    href="https://sibforms.com/serve/MUIFAGOhMLLlaeq4EfjiGDoC4EE6cPQAicXVOdGejA07xrcJRt4r2bJSuXeAcWh_vYZTM0ASarkaItDQSRMmgxBUwXIPBIa7s8jeM9Sxw-MzBiPP4gh91R4C83m_vco-0ybQLgJnW9rZMqRh5Fy2ocfg0rW8RuF5wygOJW95CRqEWhKWTP8lwDeS4fAHrfnYIioGopehOegezSq1"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.subscriptionButton}
  >
    🔔 Subscribe
  </a>

  <p className={styles.smallText}>
    We'll email you once a week when new rankings drop. No spam, unsubscribe anytime.
  </p>
</div>


      {/* Share Buttons */}
      <ShareButtons url={`${SITE_URL}/rankings`} title="Check out this week's Practical Progress Power Rankings!" />

      {/* Easter-Egg Popup */}
      {easterEggMessage && (
        <div style={{
          position:'fixed', bottom:'20px', left:'50%',
          transform:'translateX(-50%)',
          backgroundColor:'#1D4ED8', color:'white',
          padding:'12px 24px', borderRadius:'9999px',
          fontSize:'16px', fontWeight:'bold',
          boxShadow:'0 4px 12px rgba(0,0,0,0.25)',
          zIndex:10000, animation:'fadeInOut 5s ease forwards'
        }}>
          {easterEggMessage}
        </div>
      )}
    </div>
  );
}

// ——— RankingCard Component ———
function RankingCard({ entry, legislatorsCache, bioguideMap, triggerEasterEgg }) {
  const [expanded, setExpanded]       = useState(false);
  const [deepExpanded, setDeepExpanded] = useState(false);

  const {
    name, rank, lastRank, metascore,
    summary, justification, coreScores,
    mediaBreakdown, financeBreakdown,
    legislativeDetails, ideologyRaw,
    votes, bills, citations, photoUrl: cmsUrl
  } = entry;

  const change = lastRank != null ? lastRank - rank : 0;
  const cached = legislatorsCache[name]||{};
  const chamberName = cached.chamber
    ? cached.chamber.charAt(0).toUpperCase()+cached.chamber.slice(1)
    : 'Chamber';

  const bioguide = cached.bioguide||bioguideMap[name];
  const localPhoto = bioguide ? `/images/politicians/${bioguide.toUpperCase()}.jpg` : null;
  const photoUrl = localPhoto||cmsUrl||'/images/politicians/default-politician.jpg';

  return (
    <div className={styles.card} id={name.replace(/\s+/g,'-')}>
      <div className={styles.headerRow}>
        <div className={styles.rank}>{rank}</div>
        <div className={styles.photo}>
          <img src={photoUrl} alt={`${name} headshot`}
               className={styles.image} loading="lazy"
               onError={e=>e.currentTarget.src='/images/politicians/default-politician.jpg'}/>
        </div>
        <div className={styles.metaBlock}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.chamber}>{chamberName}, {cached.state||'State'} ({cached.party||'Party'})</p>
          <p className={styles.metascore}>Metascore: {metascore.toFixed(2)}</p>
          <p className={styles.change} style={{color: change>=0?'green':'red'}}>
            {change===0?'—': change>0?`▲ ${change}`:`▼ ${Math.abs(change)}`} from last week
          </p>
          <ShareButtons url={`${SITE_URL}/rankings/${entry._key}`}
                        title={`${name} scored ${metascore.toFixed(2)} – see details!`} />
        </div>

        <button className={styles.expandButtonLarge}
                onClick={()=>{
                  setExpanded(!expanded);
                  triggerEasterEgg('expansion');
                  if (!expanded && politicianMessages[name]) {
                    triggerEasterEgg('politician', name);
                  }
                }}>
          {expanded?'Hide':'See More'}
        </button>
      </div>

      {expanded && (
        <div className={styles.levelOne}>
          <p className={styles.summary}>{summary}</p>
          <h4 className={styles.coreHeader}>⭐ Core Factors</h4>
          <div className={styles.coreScores}>
            <span className={styles.badge}>📰 Media Impact: {coreScores?.weeklyMediaImpact}</span>
            <span className={styles.badge}>🗳️ Progressive Consistency: {coreScores?.progressiveConsistency}</span>
            <span className={styles.badge}>🏛️ Legislative Power: {coreScores?.legislativePower}</span>
            <span className={styles.badge}>🧭 Ideology: {coreScores?.ideology}</span>
            <span className={styles.badge}>💰 Donor Ethics: {coreScores?.finance}</span>
          </div>
          <button className={styles.expandButtonLarge}
                  onClick={()=>{
                    setDeepExpanded(!deepExpanded);
                    triggerEasterEgg('expansion');
                  }}>
            {deepExpanded?'Hide Breakdown':'See Full Breakdown'}
          </button>
        </div>
      )}

      {deepExpanded && (
        <div className={styles.levelTwo}>
          {/* Justification */}
          {justification && (
            <>
              <h4 className={styles.sectionTitle}>🧠 Weekly News Summary</h4>
              <div className={styles.paragraph}><PortableText value={justification}/></div>
            </>
          )}

          {/* Media Impact Breakdown */}
          <h4 className={styles.sectionTitle}>📰 Media Impact Breakdown</h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Policy:</strong> {mediaBreakdown?.policyImpact}</li>
            <li className={styles.badge}><strong>Perception:</strong> {mediaBreakdown?.publicPerception}</li>
            <li className={styles.badge}><strong>Controversy:</strong> {mediaBreakdown?.controversy}</li>
            <li className={styles.badge}><strong>Clout:</strong> {mediaBreakdown?.mediaClout}</li>
          </ul>

          {/* Voting */}
          <h4 className={styles.sectionTitle}>🗳️ Progressive Voting Consistency</h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Crucial (Lifetime):</strong> {votes?.crucialLifetime ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Crucial (Current):</strong> {votes?.crucialCurrent ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Overall (Lifetime):</strong> {votes?.overallLifetime ?? 'N/A'}%</li>
            <li className={styles.badge}><strong>Overall (Current):</strong> {votes?.overallCurrent ?? 'N/A'}%</li>
          </ul>

          {/* Finance */}
          <h4 className={styles.sectionTitle}>💰 Top Donor Industries</h4>
          {financeBreakdown?.length>0 ? (
            <ul className={styles.badgeList}>
              {financeBreakdown.map(f=>(
                <li key={f._key} className={styles.badge}>{f.industry}</li>
              ))}
            </ul>
          ) : <p className={styles.paragraph}>No donor data available.</p>}

          {/* Ideology */}
          <h4 className={styles.sectionTitle}>🧭 Ideology</h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Raw Score:</strong> {ideologyRaw}</li>
          </ul>

          {/* Legislative Details */}
          <h4 className={styles.sectionTitle}>🏛️ Legislative Data</h4>
          <ul className={styles.badgeList}>
            <li className={styles.badge}><strong>Tenure:</strong> {legislativeDetails?.tenure} years</li>
          </ul>

          {/* Committees */}
          {legislativeDetails?.committeeMemberships?.length>0 && (
            <>
              <p className={styles.paragraph}><strong>Committee Memberships:</strong></p>
              <ul className={styles.badgeList}>
                {legislativeDetails.committeeMemberships.map((c,i)=>(
                  <li key={i} className={styles.badge}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {legislativeDetails?.committeeLeaderships?.length>0 && (
            <>
              <p className={styles.paragraph}><strong>Leadership Roles:</strong></p>
              <ul className={styles.badgeList}>
                {legislativeDetails.committeeLeaderships.map((c,i)=>(
                  <li key={i} className={styles.badge}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {/* Bills */}
          {bills?.length>0 && (
            <>
              <h4 className={styles.sectionTitle}>📜 Sponsored Bills</h4>
              <ul className={styles.billList}>
                {bills.map(bill=>(
                  <li key={bill._key} className={styles.billItem}>
                    <a href={bill.url} target="_blank" rel="noopener noreferrer" className={styles.billLink}>
                      {bill.billNumber}: {bill.title}
                    </a>
                    <p className={styles.billMeta}>
                      <strong>Keyword:</strong> {bill.policyKeyword} | <strong>Score:</strong> {bill.progressiveScore} | <strong>Date:</strong> {bill.statusDate}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Citations */}
          {citations?.length>0 && (
            <>
              <h4 className={styles.sectionTitle}>🔗 News Citations</h4>
              <ul className={styles.citationList}>
                {citations.map(cite=>(
                  <li key={cite._key} className={styles.citationItem}>
                    <a href={cite.url} target="_blank" rel="noopener noreferrer" className={styles.citationLink}>
                      {cite.title} ({cite.source}, {new Date(cite.published).toLocaleDateString()})
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
