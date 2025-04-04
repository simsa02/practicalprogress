// pages/mission.js
import sanityClient from '../lib/sanity/sanity';
import MissionContent from '../components/MissionContent';

export default function Mission({ mission }) {
  return <MissionContent mission={mission} />;
}

export async function getStaticProps() {
  try {
    const mission = await sanityClient.fetch(`
      *[_type == "missionPage"][0] {
        title,
        description
      }
    `);

    return {
      props: { mission },
      revalidate: 60,
    };
  } catch (err) {
    console.error("Failed to fetch mission page:", err);
    return {
      props: { mission: null },
    };
  }
}
