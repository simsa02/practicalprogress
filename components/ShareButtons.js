// components/ShareButtons.js
import { useCallback } from 'react';
import styles from './ShareButtons.module.css';
import Image from 'next/image';

const ShareButtons = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  }, [url]);

  return (
    <div className={styles.shareWrapper}>
      <span className={styles.label}>Share:</span>
      <div className={styles.buttons}>
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image
            src="/images/social/PNG/Color/x.png"
            alt="Share on X"
            width={28}
            height={28}
            className={styles.icon}
          />
        </a>
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image
            src="/images/social/PNG/Color/Facebook.png"
            alt="Share on Facebook"
            width={28}
            height={28}
            className={styles.icon}
          />
        </a>
        {/* Reddit */}
        <a
          href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image
            src="/images/social/PNG/Color/Reddit.png"
            alt="Share on Reddit"
            width={28}
            height={28}
            className={styles.icon}
          />
        </a>
        {/* Bluesky */}
        <a
          href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <Image
            src="/images/social/PNG/Color/Bluesky.png"
            alt="Share on Bluesky"
            width={28}
            height={28}
            className={styles.icon}
          />
        </a>
        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={styles.iconButton}
          aria-label="Copy link"
        >
          <Image
            src="/images/icons/link.png"
            alt="Copy link"
            width={28}
            height={28}
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;