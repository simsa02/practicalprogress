import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" legacyBehavior>
          <a className={styles.homeLink}>Home</a>
        </Link>
      </div>

      <div className={styles.centerSection}>
        <h1 className={styles.title}>Practical Progress</h1>
      </div>

      <div className={styles.rightSection}>
        <Link href="/mission" legacyBehavior>
          <a className={styles.link}>Mission</a>
        </Link>
        <Link href="/rankings" legacyBehavior>
          <a className={styles.link}>Power Rankings</a>
        </Link>
        <Link href="/editorials" legacyBehavior>
          <a className={styles.link}>Editorials</a>
        </Link>
        <a
          href="https://www.buymeacoffee.com/tsims49i"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.donateButton}
        >
          Donate
        </a>
        <a
          href="https://www.reddit.com/r/PracticalProgress/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Reddit
        </a>
      </div>
    </nav>
  );
}
