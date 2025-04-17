import Head from 'next/head';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Practical Progress</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>📬 Contact Us</h1>
        <p className={styles.description}>
          Have a question, suggestion, or want to collaborate? We’d love to hear from you.
        </p>

        <form
          action="https://formspree.io/f/xyzeawyz"
          method="POST"
          className={styles.form}
        >
          <label className={styles.label}>
            Your Name
            <input
              type="text"
              name="name"
              required
              className={styles.input}
              placeholder="Jane Doe"
            />
          </label>

          <label className={styles.label}>
            Your Email
            <input
              type="email"
              name="email"
              required
              className={styles.input}
              placeholder="you@example.com"
            />
          </label>

          <label className={styles.label}>
            Message
            <textarea
              name="message"
              required
              className={styles.textarea}
              placeholder="What's on your mind?"
            />
          </label>

          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}
