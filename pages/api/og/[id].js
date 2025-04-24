// pages/api/og/[id].js
import { ImageResponse } from '@vercel/og'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import legislatorsCache from '../../../data/legislators_cache.json'

export const config = {
  runtime: 'edge',
}

const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com'
const DEFAULT_IMG = '/images/politicians/default-politician.jpg'

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

export default async function handler(req) {
  try {
    const id = new URL(req.url).pathname.split('/').pop()

    const entry = await client.fetch(
      groq`
        *[_type == "weeklyPowerRanking"]
          | order(week desc)[0]
          .entries[_key == $key][0] {
            _key,
            name,
            rank,
            lastRank,
            metascore
          }
      `,
      { key: id }
    )

    if (!entry) {
      return new Response('Not found', { status: 404 })
    }

    const meta = legislatorsCache[entry.name] || {}

    // determine headshot URL directly from static path
    let photoSrc = ''
    if (meta.bioguide) {
      const code = meta.bioguide.toUpperCase()
      photoSrc = `${SITE_URL}/images/politicians/${code}.jpg`
    }
    if (!photoSrc) {
      photoSrc = `${SITE_URL}${DEFAULT_IMG}`
    }

    const delta = entry.lastRank != null ? entry.lastRank - entry.rank : 0
    const deltaText =
      delta === 0 ? '—'
      : delta > 0   ? `▲ ${delta}`
                    : `▼ ${Math.abs(delta)}`

    const chamberLabel = meta.chamber
      ? meta.chamber.charAt(0).toUpperCase() + meta.chamber.slice(1)
      : 'Chamber'
    const stateLabel = meta.state || 'State'
    const partyLabel = meta.party || 'Party'

    const jsx = (
      <div style={{
        width: 1200,
        height: 630,
        background: '#ffffff',
        border: '2px solid #e5e5e5',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        padding: 40,
        fontFamily: 'system-ui, sans-serif',
        color: '#222',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', flex: 1 }}>
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
          <img
            src={photoSrc}
            width={300}
            height={300}
            crossOrigin="anonymous"
            style={{
              borderRadius: 12,
              border: '4px solid #0052cc',
              objectFit: 'cover',
              margin: '0 40px',
            }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 60, color: '#0052cc' }}>
              {entry.name}
            </h1>
            <p style={{ margin: '12px 0', fontSize: 30, color: '#444' }}>
              {chamberLabel}, {stateLabel} ({partyLabel})
            </p>
            <p style={{ margin: '20px 0 0', fontSize: 46 }}>
              Metascore: {entry.metascore.toFixed(2)}
            </p>
            <p style={{
              margin: '8px 0 0',
              fontSize: 38,
              color: delta >= 0 ? 'green' : 'red',
            }}>
              {deltaText} from last week
            </p>
          </div>
        </div>
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
      headers: {
        'cache-control': 'public, max-age=604800',
      },
    })
  } catch (err) {
    console.error(err)
    return new Response('Error generating image', { status: 500 })
  }
}
