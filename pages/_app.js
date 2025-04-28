import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Critical Facebook Open Graph Fallbacks */}
        <meta 
          property="og:image" 
          content={`${process.env.NEXT_PUBLIC_SITE_URL}/default-social.jpg`} 
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
      </Head>

      <Navbar />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}