// pages/index.js
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Practical Progress</title>
        <meta name="description" content="Progressive politics rooted in results, not rhetoric." />
      </Head>

      <div className={styles.hero}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
          poster="/fallback.jpg"
          onError={(e) => console.error("Video failed to load:", e)}
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={styles.overlay}>
          <h1 className={styles.title}>Practical Progress</h1>
          <p className={styles.tagline}>Real policy. Real people. Real change.</p>
          <div className={styles.ctaWrap}>
            <a href="/mission" className={styles.cta}>Explore Our Mission</a>
          </div>
        </div>
      </div>
    </>
  );
}
g