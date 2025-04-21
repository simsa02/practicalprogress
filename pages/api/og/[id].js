// pages/api/og/[id].js
import { ImageResponse } from '@vercel/og'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'

export const config = { runtime: 'edge' }

// Sanity client – pulls the one entry for this key
const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
})

export default async function handler(req) {
  try {
    const { pathname } = new URL(req.url)
    const id = pathname.split('/').pop()

    // Fetch the single entry by its _key from the latest ranking
    const entry = await client.fetch(
      groq`*[_type=="weeklyPowerRanking"] | order(week desc)[0]
            .entries[_key == $key][0]`,
      { key: id }
    )

    if (!entry) {
      return new Response('Not Found', { status: 404 })
    }

    const delta = entry.lastRank != null
      ? entry.lastRank - entry.rank
      : 0

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            padding: 40,
            boxSizing: 'border-box',
            fontFamily: 'system-ui, sans-serif',
            border: '4px solid #0052cc',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 64, color: '#0052cc' }}>
                {entry.name}
              </h1>
              <p style={{ margin: '16px 0 0', fontSize: 40 }}>
                Metascore: {entry.metascore.toFixed(2)}
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 32,
                  color: delta >= 0 ? 'green' : 'red',
                }}
              >
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} from last week
              </p>
            </div>
            <img
              src={entry.photoUrl}
              width={300}
              height={300}
              style={{
                borderRadius: 12,
                objectFit: 'cover',
                marginLeft: 40,
              }}
              crossOrigin="anonymous"
            />
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: 24,
              color: '#666',
            }}
          >
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
