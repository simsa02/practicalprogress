// pages/api/og/[id].js
import { ImageResponse } from '@vercel/og'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'

export const config = { runtime: 'edge' }

// ——— CONSTANTS ———
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com'
const CACHE_URL   = `${SITE_URL}/data/legislators_cache.json`
const DEFAULT_IMG = '/images/politicians/default-politician.jpg'

// ——— SANITY ———
const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

export default async function handler(req) {
  try {
    // 1) Parse _key from /api/og/[id]
    const id = new URL(req.url).pathname.split('/').pop()

    // 2) Latest entry with that key
    const entry = await client.fetch(
      groq`*[_type=="weeklyPowerRanking"] | order(week desc)[0]
            .entries[_key == $key][0]`,
      { key: id }
    )
    if (!entry) return new Response('Not found', { status: 404 })

    // 3) Lookup extra metadata from public cache
    let meta = {}
    try {
      const res  = await fetch(CACHE_URL, { cache: 'force-cache' })
      const json = await res.json()
      meta = json[entry.name] ?? {}
    } catch (_) {
      // ignore — will fall back to placeholders
    }
    const { bioguide, state, chamber, party } = meta

    // 4) Head‑shot → local jpg → CMS url → default
    const localPhoto =
      bioguide ? `${SITE_URL}/images/politicians/${bioguide.toUpperCase()}.jpg`
               : null
    const photoSrc  = localPhoto || entry.photoUrl || `${SITE_URL}${DEFAULT_IMG}`

    // 5) Rank delta
    const delta = entry.lastRank != null ? entry.lastRank - entry.rank : 0
    const deltaText =
      delta === 0 ? '—'
      : delta > 0 ? `▲ ${delta}`
                  : `▼ ${Math.abs(delta)}`

    // 6) Render image
    const jsx = (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#ffffff',
          border: '2px solid #e5e5e5',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          padding: 40,
          fontFamily: 'system-ui, sans-serif',
          boxSizing: 'border-box',
          color: '#222',
        }}
      >
        {/* ROW */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Rank */}
          <div style={{
            width: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 120,
            fontWeight: 700,
            color: '#0052cc',
          }}>
            {entry.rank}
          </div>

          {/* Photo */}
          <img
            src={photoSrc}
            width={300}
            height={300}
            style={{
              borderRadius: 12,
              border: '4px solid #0052cc',
              objectFit: 'cover',
              margin: '0 40px',
            }}
            crossOrigin="anonymous"
          />

          {/* Text */}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 60, color: '#0052cc' }}>
              {entry.name}
            </h1>
            <p style={{ margin: '12px 0', fontSize: 30, color: '#444' }}>
              {chamber ? chamber.charAt(0).toUpperCase() + chamber.slice(1) : 'Chamber'}
              , {state || 'State'} ({party || 'Party'})
            </p>
            <p style={{ margin: '20px 0 0', fontSize: 46 }}>
              Metascore: {entry.metascore.toFixed(2)}
            </p>
            <p style={{
              margin: '8px 0 0',
              fontSize: 38,
              color: delta >= 0 ? 'green' : 'red',
            }}>
              {deltaText} from last week
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'right',
          fontSize: 26,
          color: '#888',
        }}>
          practical-progress.com
        </div>
      </div>
    )

    return new ImageResponse(jsx, {
      width: 1200,
      height: 630,
      headers: { 'cache-control': 'public, max-age=604800' }, // 7 days
    })
  } catch (err) {
    console.error(err)
    return new Response('Error', { status: 500 })
  }
}
