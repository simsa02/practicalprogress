// pages/api/og/[id].js
import { ImageResponse } from '@vercel/og'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'

export const config = { runtime: 'edge' }

//–– Sanity client ––
const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://practical-progress.com'

export default async function handler(req) {
  try {
    const { pathname } = new URL(req.url)
    const id = pathname.split('/').pop()

    // fetch the specific entry from the latest ranking
    const entry = await client.fetch(
      groq`
        *[_type=="weeklyPowerRanking"] | order(week desc)[0]
          .entries[_key == $key][0]
      `,
      { key: id }
    )

    if (!entry) {
      return new Response('Not Found', { status: 404 })
    }

    // calculate change
    const delta = entry.lastRank != null ? entry.lastRank - entry.rank : 0

    // determine headshot URL: prefer your local folder
    // note: this will hit your deployed /public/images/politicians/{BIOGUIDE}.jpg
    const bioguide = entry.bioguide || entry._key  // if you saved bioguide in Sanity, use that; otherwise default to key
    const localPhoto = `${SITE_URL}/images/politicians/${bioguide.toUpperCase()}.jpg`
    const photoSrc = entry.photoUrl || localPhoto

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: '#fff',
            border: '2px solid #ddd',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, sans-serif',
            boxSizing: 'border-box',
            padding: 40,
            color: '#222',
          }}
        >
          {/* Top row: rank, photo, details */}
          <div style={{ display: 'flex', flex: 1 }}>
            {/* Rank number */}
            <div style={{
              flex: '0 0 150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 120,
              fontWeight: 'bold',
              color: '#0052cc',
            }}>
              {entry.rank}
            </div>

            {/* Photo */}
            <div style={{
              flex: '0 0 300px',
              margin: '0 40px',
            }}>
              <img
                src={photoSrc}
                width={300}
                height={300}
                style={{
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: '4px solid #0052cc',
                }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Name & stats */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: 0,
                fontSize: 64,
                color: '#0052cc',
              }}>
                {entry.name}
              </h1>
              {/* Chamber, State, Party */}
              <p style={{
                margin: '12px 0',
                fontSize: 28,
                color: '#555',
              }}>
                {entry.chamber || 'Chamber'}, {entry.state || 'State'} ({entry.party || 'Party'})
              </p>
              {/* Metascore */}
              <p style={{ margin: '20px 0 0', fontSize: 48 }}>
                Metascore: {entry.metascore.toFixed(2)}
              </p>
              {/* Delta */}
              <p style={{
                margin: '8px 0 0',
                fontSize: 40,
                color: delta >= 0 ? 'green' : 'red',
              }}>
                {delta === 0
                  ? '—'
                  : delta > 0
                  ? `▲ ${delta}`
                  : `▼ ${Math.abs(delta)}`}
                {' '}from last week
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'right',
            fontSize: 24,
            color: '#888',
          }}>
            practical-progress.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Error generating image', { status: 500 })
  }
}
