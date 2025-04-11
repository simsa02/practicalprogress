import { createClient } from 'next-sanity';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Methodology.module.css';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

const query = groq`
  *[_type == "methodology"][0]{
    title,
    intro,
    body
  }
`;

export async function getStaticProps() {
  const methodology = await client.fetch(query);
  return {
    props: { methodology },
    revalidate: 60,
  };
}

export default function MethodologyPage({ methodology }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{methodology.title || 'Methodology'}</title>
        <meta name="description" content="How we calculate our Progressive Power Rankings" />
      </Head>

      <Link href="/rankings" className={styles.expandButtonLarge}>
        ← Back to Rankings
      </Link>

      <h1 className={styles.title}>{methodology.title}</h1>

      {methodology.intro && (
        <p className={styles.intro}>{methodology.intro}</p>
      )}

      <div className={styles.content}>
        <PortableText value={methodology.body} />
      </div>
    </div>
  );
}
