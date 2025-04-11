// components/ShareButtons.js
import styles from './ShareButtons.module.css';
import Image from 'next/image';

const ShareButtons = ({ url, title }) => {
  return (
    <div className={styles.shareWrapper}>
      <span className={styles.label}>Share:</span>
      <div className={styles.buttons}>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image src="/images/social/PNG/Color/x.png" alt="X" width={28} height={28} className={styles.icon} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image src="/images/social/PNG/Color/facebook.png" alt="Facebook" width={28} height={28} className={styles.icon} />
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image src="/images/social/PNG/Color/reddit.png" alt="Reddit" width={28} height={28} className={styles.icon} />
        </a>
        <a
          href={`https://www.instagram.com/`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image src="/images/social/PNG/Color/instagram.png" alt="Instagram" width={28} height={28} className={styles.icon} />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
