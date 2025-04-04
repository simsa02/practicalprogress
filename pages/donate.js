import Head from 'next/head';
import styles from '../styles/Donate.module.css';
export default function Donate() {
  return (
    <>
      <Head>
        <title>Support Our Movement | Practical Progress</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.backgroundOverlay} />
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>Support Our Movement</h1>
          <div className={styles.donateBox}>
            <p>
              Help us drive real change by supporting Practical Progress. Your contribution enables us to expand our reach, amplify progressive voices, and hold power to account with actionable reporting and weekly rankings.
            </p>
            <p>
              Every donation makes a difference. Let's build a future rooted in accountability, equity, and common sense.
            </p>
          </div>
          <div className={styles.buttonContainer}>
            <a
              href="https://www.buymeacoffee.com/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.donateButton}
            >
              Buy Me a Coffee ☕
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
