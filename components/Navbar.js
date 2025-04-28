import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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

      <div className={styles.mobileToggle} onClick={toggleMenu}>
        <span className={styles.mobileIcon}>{isOpen ? '×' : '☰'}</span>
      </div>

      <div className={`${styles.rightSection} ${isOpen ? styles.open : ''}`}>
        <Link href="/mission" className={styles.link} onClick={closeMenu}>
          Mission
        </Link>
        <Link href="/rankings" className={styles.link} onClick={closeMenu}>
          Rankings
        </Link>
        <Link href="/editorials" className={styles.link} onClick={closeMenu}>
          Editorials
        </Link>
        <Link href="/contact" className={styles.link} onClick={closeMenu}>
          Contact
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
        <a
          href="https://x.com/PractProgOrg"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          X
        </a>
        <a
          href="https://bsky.app/profile/practical-progress.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Bluesky
        </a>
      </div>
    </nav>
  );
}
