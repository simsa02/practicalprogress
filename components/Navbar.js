import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.homeLink}>
          Home
        </Link>
      </div>

      <div className={styles.centerSection}>
        <h1 className={styles.title}>Practical Progress</h1>
      </div>

      <div className={styles.rightSection}>
        <Link href="/mission" className={styles.link}>
          Mission
        </Link>
        <Link href="/rankings" className={styles.link}>
          Rankings
        </Link>
        <Link href="/editorials" className={styles.link}>
          Editorials
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
