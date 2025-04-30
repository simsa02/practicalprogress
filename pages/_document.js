// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Character set */}
          <meta charSet="UTF-8" />

          {/* Facebook Open Graph */}
          <meta property="og:site_name" content="Practical Progress" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta 
            property="fb:app_id" 
            content={process.env.NEXT_PUBLIC_FB_APP_ID} 
          />

          {/* Twitter/X Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta 
            name="twitter:site" 
            content="@PractProgOrg"  // Replace with your X/Twitter handle
          />
          <meta 
            name="twitter:creator" 
            content="@PractProgOrg"  // Replace with content creator's handle
          />

          {/* Bluesky (uses similar tags to Twitter) */}
          <meta name="bluesky:card" content="summary_large_image" />
          <meta 
            name="bluesky:site" 
            content="practical-progress.bsky.social"  // Bluesky handle
          />

          {/* Reddit (primarily uses Open Graph but can add specific) */}
          <meta name="reddit:domain" content="https://practicalprogress.com" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}