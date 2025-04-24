// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Facebook App ID for Open Graph */}
          <meta
            property="fb:app_id"
            content={process.env.NEXT_PUBLIC_FB_APP_ID}
          />
          {/* (Optional) Default OG tags you want on every page */
          /*  You can also pull in your SITE_URL env var here if needed */} 
          <meta
            property="og:site_name"
            content="Practical Progress"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
