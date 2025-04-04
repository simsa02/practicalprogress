import React, { useState } from 'react';
import styles from '../styles/SubscriptionForm.module.css';

/**
 * Component for subscribing to power rankings updates
 */
const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('/api/subscribeToRankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! You will receive weekly updates.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className={styles.subscriptionContainer}>
      <h3 className={styles.subscriptionTitle}>Get Weekly Rankings in Your Inbox</h3>
      <p className={styles.subscriptionDescription}>
        Stay updated on the latest progressive power moves. We'll send you the new rankings every Monday.
      </p>
      
      <form className={styles.subscriptionForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className={styles.emailInput}
            disabled={status === 'loading' || status === 'success'}
          />
          
          <button
            type="submit"
            className={styles.subscribeButton}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {message && (
          <p className={`${styles.message} ${status === 'error' ? styles.errorMessage : styles.successMessage}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SubscriptionForm;