import { sanityClient } from '../../lib/sanity/sanity';
import styles from '../../styles/Editorial.module.css';
import { PortableText } from '@portabletext/react';

// Helper to generate a unique key for Portable Text blocks.
function generateKey() {
  return Math.random().toString(36).substring(2);
}

// Normalize plain string content into a Portable Text array.
function normalizePortableText(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const paragraphs = value.split(/\n\s*\n/).filter((para) => para.trim().length > 0);
    return paragraphs.map((para) => ({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: generateKey(),
          text: para,
          marks: []
        }
      ]
    }));
  }
  return [];
}

// Utility: Generate social share URLs.
const generateShareUrls = (pageUrl, title) => ({
  reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
});

export default function EditorialArticle({ editorial }) {
  if (!editorial) return <div>Editorial not found</div>;

  const formattedDate = editorial.publishedDate
    ? new Date(editorial.publishedDate).toLocaleDateString()
    : 'Date Unknown';

  // Ensure content is always an array of Portable Text blocks.
  const content = Array.isArray(editorial.content)
    ? editorial.content
    : normalizePortableText(editorial.content);

  // Use optional chaining for safety.
  const pageUrl = `http://localhost:3000/editorials/${editorial.slug?.current}`;
  const shareUrls = generateShareUrls(pageUrl, editorial.title);

  return (
    <div className={styles.singleEditorialContainer}>
      {/* Social Share Bar */}
      <div className={styles.shareBar}>
        <a href={shareUrls.reddit} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Reddit.png" alt="Share on Reddit" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.x} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/x.png" alt="Share on X" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Facebook.png" alt="Share on Facebook" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.instagram} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Instagram.png" alt="Share on Instagram" className={styles.shareIcon} />
        </a>
        <a href={shareUrls.tiktok} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
          <img src="/images/social/PNG/Color/Tik Tok.png" alt="Share on TikTok" className={styles.shareIcon} />
        </a>
      </div>

      <div className={styles.editorialHeader}>
        <h1>{editorial.title}</h1>
        <p className={styles.datePublished}>{formattedDate}</p>
      </div>
      
      <div className={styles.editorialContent}>
        {editorial.description && (
          <p className={styles.description}>{editorial.description}</p>
        )}
        {editorial.content && (
          <PortableText
            value={content}
            components={{
              block: ({ children }) => <p>{children}</p>, // Ensure these <p> tags use styles with "white-space" set appropriately.
            }}
          />
        )}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const query = `*[_type == "editorial" && defined(slug.current)]{
    "slug": slug.current
  }`;
  const editorials = await sanityClient.fetch(query);
  const paths = editorials?.map((editorial) => ({
    params: { slug: editorial.slug }
  })) || [];
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const query = `*[_type == "editorial" && slug.current == $slug][0]{
    title,
    publishedDate,
    description,
    content,
    slug
  }`;
  const editorial = await sanityClient.fetch(query, { slug: params.slug });
  return {
    props: {
      editorial,
    },
    revalidate: 60,
  };
}
