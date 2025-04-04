import { sanityClient } from '../../lib/sanity/sanity';
import styles from '../../styles/Editorial.module.css';
import { PortableText } from '@portabletext/react';
export default function EditorialArticle({ editorial }) {
  if (!editorial) return <div>Editorial not found</div>;
  return (
    <div className={styles.singleEditorialContainer}>
      <div className={styles.editorialHeader}>
        <h1>{editorial.title}</h1>
        <p className={styles.datePublished}>
          {new Date(editorial.publishedDate).toLocaleDateString()}
        </p>
      </div>
      <div className={styles.editorialContent}>
        {editorial.content && (
          <PortableText
            value={editorial.content}
            components={{
              block: ({ children }) => <p>{children}</p>,
            }}
          />
        )}
      </div>
    </div>
  );
}
export async function getStaticPaths() {
  const query = `*[_type == "editorial" && defined(slug.current)] {
    "slug": slug.current
  }`;

  const editorials = await sanityClient.fetch(query);
  // Ensure we have valid slugs before mapping
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
    publishedAt,
    content
  }`;

  const editorial = await sanityClient.fetch(query, { slug: params.slug });

  return {
    props: {
      editorial,
    },
    revalidate: 60,
  };
}
