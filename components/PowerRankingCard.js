import React from 'react';
import FaceDetectionImage from '@/components/FaceDetectionImage';
import { getBlurbById } from '@/data/politicianBlurbs';
import styles from '@/styles/PowerRankingCard.module.css';

const PowerRankingCard = ({ politician, ranking, weekDate }) => {
  const currentWeekDate = weekDate || ranking?.weekStart;

  const {
    name = 'Unknown',
    position = 'Representative',
    level = 'Federal',
    state = 'N/A',
    id,
    photo = '/images/politicians/placeholder.jpg',
    party = 'Democratic',
  } = politician || {};

  const {
    rank = 0,
    metascore: rawMetascore,
    scoreBreakdown = {},
    writeup,
    movement = '0',
    highlight,
  } = ranking || {};

  const rawMetascoreNum = parseFloat(rawMetascore || 0);
  const cappedMetascore = Math.min(rawMetascoreNum, 100);
  const metascore = isNaN(cappedMetascore) ? '0.00' : cappedMetascore.toFixed(2);

  if (process.env.NODE_ENV === 'development' && rank <= 5) {
    console.log(`Politician: ${name}, Rank: ${rank}, Metascore: ${metascore}`);
  }

  const getMovementIndicator = () => {
    const isMarch17 = currentWeekDate?.includes('2025-03-17');
    if (isMarch17 || movement === '0' || movement === '=') {
      return <span className={`${styles.movement} ${styles.neutral}`}>⟡ STEADY</span>;
    }
    if (movement === 'NEW' || movement === 'New Entry') {
      return <span className={`${styles.movement} ${styles.newEntry}`}>NEW</span>;
    }
    if (movement.startsWith('+')) {
      return <span className={`${styles.movement} ${styles.positive}`}>▲ {movement}</span>;
    }
    if (movement.startsWith('-')) {
      return <span className={`${styles.movement} ${styles.negative}`}>▼ {movement}</span>;
    }
    return <span className={`${styles.movement} ${styles.neutral}`}>⟡ STEADY</span>;
  };

  const getTier = () => {
    if (rank <= 5) return styles.topTier;
    if (rank <= 15) return styles.midTier;
    return styles.baseTier;
  };

  if (!politician || !ranking) {
    return <div className={styles.errorCard}>Missing politician data</div>;
  }

  const formatScore = (val, cap) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? '0.00' : Math.min(parsed, cap).toFixed(2);
  };

  return (
    <div className={`${styles.card} ${getTier()}`}>
      <div className={styles.rankContainer}>
        <div className={styles.rank}>#{rank}</div>
        {getMovementIndicator()}
      </div>

      <div className={styles.imageContainer}>
        <FaceDetectionImage
          src={photo}
          alt={name}
          width={120}
          height={120}
          className={styles.politicianImage}
          politicianId={id || name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}
          fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Placeholder_profile_image.png/640px-Placeholder_profile_image.png"
        />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2 className={styles.name}>{name}</h2>
          <div className={styles.meta}>
            <span className={styles.position}>{position}</span>
            <span className={styles.party}>{party}</span>
            <span className={styles.level}>{level}</span>
            <span className={styles.state}>{state}</span>
          </div>
        </div>

        <div className={styles.scoreContainer}>
          <div className={styles.metascore}>
            <span className={styles.scoreValue}>{metascore}</span>
            <span className={styles.scoreLabel}>META</span>
          </div>

          <div className={styles.breakdown}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIcon}>🧠</span>
              <span className={styles.scoreItemValue}>
                {formatScore(scoreBreakdown.policyImpact, 30)}
              </span>
              <span className={styles.scoreItemLabel}>Policy</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIcon}>📢</span>
              <span className={styles.scoreItemValue}>
                {formatScore(scoreBreakdown.publicEngagement, 20)}
              </span>
              <span className={styles.scoreItemLabel}>Visibility</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIcon}>🤝</span>
              <span className={styles.scoreItemValue}>
                {formatScore(scoreBreakdown.coalitionBuilding, 20)}
              </span>
              <span className={styles.scoreItemLabel}>Coalition</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIcon}>⚡</span>
              <span className={styles.scoreItemValue}>
                {formatScore(scoreBreakdown.politicalCourage, 15)}
              </span>
              <span className={styles.scoreItemLabel}>Courage</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIcon}>📈</span>
              <span className={styles.scoreItemValue}>
                {formatScore(scoreBreakdown.momentum, 15)}
              </span>
              <span className={styles.scoreItemLabel}>Momentum</span>
            </div>
          </div>

          <div className={styles.writeupContainer}>
            <p className={styles.writeup}>
              {writeup &&
              (writeup.includes('unwavering commitment') ||
                writeup.includes('principled leadership') ||
                writeup.includes('exemplifies the principled') ||
                writeup.includes('defines effective progressive'))
                ? getBlurbById(id, politician)
                : writeup}
            </p>
            {highlight && (
              <div className={styles.highlight}>
                <span className={styles.highlightText}>{highlight}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerRankingCard;
