// components/ShareButtons.js
import { useCallback } from 'react';
import styles from './ShareButtons.module.css';
import Image from 'next/image';

const ShareButtons = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = useCallback(() => {
    // Modern clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link!'));
      return;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      alert(successful ? 'Link copied to clipboard!' : 'Failed to copy link!');
    } catch (err) {
      alert('Failed to copy link!');
    } finally {
      document.body.removeChild(textArea);
    }
  }, [url]);

  return (
    <div className={styles.shareWrapper}>
      <span className={styles.label}>Share:</span>
      <div className={styles.buttons}>
        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
          aria-label="Share on X"
        >
          <Image
            src="/images/social/PNG/Color/x.png"
            alt=""
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
          aria-label="Share on Facebook"
        >
          <Image
            src="/images/social/PNG/Color/Facebook.png"
            alt=""
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
          aria-label="Share on Reddit"
        >
          <Image
            src="/images/social/PNG/Color/Reddit.png"
            alt=""
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
          aria-label="Share on Bluesky"
        >
          <Image
            src="/images/social/PNG/Color/Bluesky.png"
            alt=""
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
            alt=""
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