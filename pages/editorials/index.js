import { useState } from 'react';
import { sanityClient } from '../../lib/sanity/sanity';
import { PortableText } from '@portabletext/react';
import styles from '../../styles/Editorials.module.css';

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
        {editorials.map((editorial, index) => (
          <div key={editorial._id} className={styles.editorialItem}>
            <div className={styles.editorialContent}>
              <h2>{editorial.title}</h2>
              <p className={styles.datePublished}>
                {new Date(editorial.publishedAt).toLocaleDateString()}
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
                <p className={styles.summary}>{editorial.excerpt}</p>
              )}

              <button className={styles.toggleButton} onClick={() => toggleExpand(index)}>
                {expandedIndex === index ? 'Collapse ▲' : 'Read Full Article ▼'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "editorial"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    publishedAt,
    content
  }`;

  const editorials = await sanityClient.fetch(query);

  return {
    props: {
      editorials,
    },
    revalidate: 60,
  };
}
