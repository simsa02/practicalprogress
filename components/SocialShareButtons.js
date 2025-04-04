import React from 'react';
import styles from '../styles/SocialShareButtons.module.css';

/**
 * Component for social sharing buttons
 * @param {Object} props - Component props
 * @param {string} props.url - URL to share
 * @param {string} props.title - Title to share
 */
const SocialShareButtons = ({ url, title }) => {
  // Use the current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Progressive Power Rankings';
  
  // Encode the URL and title for sharing
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  
  // Share on Twitter/X
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };
  
  // Share on Facebook
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };
  
  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };
  
  // Share on Reddit
  const shareOnReddit = () => {
    window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, '_blank');
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Show a tooltip or notification
      const tooltip = document.getElementById('copy-tooltip');
      if (tooltip) {
        tooltip.style.visibility = 'visible';
        setTimeout(() => {
          tooltip.style.visibility = 'hidden';
        }, 2000);
      }
    });
  };
  
  return (
    <div className={styles.shareContainer}>
      <p className={styles.shareTitle}>Share these rankings:</p>
      
      <div className={styles.shareButtons}>
        <button
          className={`${styles.shareButton} ${styles.twitter}`}
          onClick={shareOnTwitter}
          aria-label="Share on Twitter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
          </svg>
        </button>
        
        <button
          className={`${styles.shareButton} ${styles.facebook}`}
          onClick={shareOnFacebook}
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
          </svg>
        </button>
        
        <button
          className={`${styles.shareButton} ${styles.linkedin}`}
          onClick={shareOnLinkedIn}
          aria-label="Share on LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </button>
        
        <button
          className={`${styles.shareButton} ${styles.reddit}`}
          onClick={shareOnReddit}
          aria-label="Share on Reddit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8m4.5-11c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5m-9 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5m4.5 7.2c2.2 0 4-1.1 4-2.5 0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5c0 1.4 1.8 2.5 4 2.5m0-3.5c1.1 0 2 .4 2 1s-.9 1-2 1-2-.5-2-1c0-.5.9-1 2-1z" />
          </svg>
        </button>
        
        <button
          className={`${styles.shareButton} ${styles.copyLink}`}
          onClick={copyLinkToClipboard}
          aria-label="Copy link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
          <span id="copy-tooltip" className={styles.tooltip}>Link copied!</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;