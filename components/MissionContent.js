"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Mission.module.css';

export default function MissionContent({ mission }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mission) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay} />
      <div className={styles.missionContent}>
        <div className={styles.titleBlock}>
          <img
            src="/logo.png"
            alt="Practical Progress Logo"
            className={styles.logo}
            width="100"
            height="100"
          />
          <h1 className={`${styles.title} ${scrolled ? styles.scrolled : ''}`}>
            {mission.title || "Our Purpose"}
          </h1>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.contentBox}>
            {mission.description ? (
              <p className={styles.portableTextContainer}>{mission.description}</p>
            ) : (
              <p>
                Working to create practical progress in politics through accountability and action.
              </p>
            )}
          </div>
        </div>

        <div className={styles.callToAction}>
          <h2>Support Our Movement</h2>
          <p>
            No big donors. No corporate backing. Just us. Chip in and be part of the progress.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a
              href="https://buymeacoffee.com/tsims49i"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
