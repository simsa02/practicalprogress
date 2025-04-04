import { useState } from 'react';
import { sanityClient } from '../../lib/sanity/sanity';
import { PortableText } from '@portabletext/react';
import styles from '../../styles/Editorials.module.css';

// Utility: Generate social share URLs.
const generateShareUrls = (pageUrl, title) => ({
  reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  instagram: `#`, // Instagram doesn't support URL sharing
  tiktok: `#`
});

export default function Editorials({ editorials }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.editorialsContainer}>
      <div className={styles.pageHeader}>
        <h1>Editorials</h1>
        <p>Insightful commentary, bold ideas, and practical progress from our team.</p>
      </div>

      <div className={styles.editorialList}>
        {editorials.map((editorial, index) => {
          // Compute the URL for the article.
          const pageUrl = `http://localhost:3000/editorials/${editorial.slug.current}`;
          const shareUrls = generateShareUrls(pageUrl, editorial.title);

          return (
            <div key={editorial._id} className={styles.editorialItem}>
              <div className={styles.editorialContent}>
                <h2>{editorial.title}</h2>
                <p className={styles.datePublished}>
                  {new Date(editorial.publishedDate).toLocaleDateString()}
                </p>

                {expandedIndex === index ? (
                  <div className={styles.expandedText}>
                    {editorial.content && (
                      <PortableText
                        value={editorial.content}
                        components={{
                          block: ({ children }) => <p>{children}</p>,
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <p className={styles.summary}>{editorial.description}</p>
                )}

                <button className={styles.toggleButton} onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? 'Collapse ▲' : 'Read Full Article ▼'}
                </button>

                {/* Social Share Bar for each article */}
                <div className={styles.shareBar}>
                  <a href={shareUrls.reddit} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                    <img
                      src="/images/social/PNG/Color/Reddit.png"
                      alt="Share on Reddit"
                      className={styles.shareIcon}
                    />
                  </a>
                  <a href={shareUrls.x} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                    <img
                      src="/images/social/PNG/Color/x.png"
                      alt="Share on X"
                      className={styles.shareIcon}
                    />
                  </a>
                  <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                    <img
                      src="/images/social/PNG/Color/Facebook.png"
                      alt="Share on Facebook"
                      className={styles.shareIcon}
                    />
                  </a>
                  <a href={shareUrls.instagram} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                    <img
                      src="/images/social/PNG/Color/Instagram.png"
                      alt="Share on Instagram"
                      className={styles.shareIcon}
                    />
                  </a>
                  <a href={shareUrls.tiktok} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                    <img
                      src="/images/social/PNG/Color/Tik Tok.png"
                      alt="Share on TikTok"
                      className={styles.shareIcon}
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "editorial"] | order(publishedDate desc) {
    _id,
    title,
    description,
    publishedDate,
    content,
    slug
  }`;

  const editorials = await sanityClient.fetch(query);

  return {
    props: {
      editorials,
    },
    revalidate: 60,
  };
}
