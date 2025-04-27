import { createClient } from 'next-sanity';
import { groq } from 'next-sanity';
import Link from 'next/link';
import { format } from 'date-fns';
import styles from '../../styles/PowerRankings.module.css';

const client = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
});

const query = groq`
  *[_type == "weeklyPowerRanking"] | order(week desc){
    _id,
    week,
    weekTitle,
    "slug": _id
  }
`;

export async function getStaticProps() {
  const weeks = await client.fetch(query);
  return {
    props: { weeks },
    revalidate: 60
  };
}

export default function Archive({ weeks }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Weekly Rankings Archive</h1>
      <p className={styles.pageSummary}>Explore all past Practical Progress Power Rankings by week.</p>
      <ul className={styles.badgeList}>
        {weeks && weeks.length > 0 && weeks.map((w) => (
          <li key={w._id} className={styles.badge}>
            <Link href={`/rankings/week/${w.slug}`}>
              {w.weekTitle || `Week of ${format(new Date(w.week), 'MMMM d, yyyy')}`}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/rankings" className={styles.expandButtonLarge}>
        ← Back to Latest Rankings
      </Link>
    </div>
  );
}