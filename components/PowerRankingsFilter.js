// src/components/PowerRankingsFilter.js
import React from 'react';
import styles from './PowerRankingsFilter.module.css';

const PowerRankingsFilter = ({ 
  filterLevel, 
  setFilterLevel, 
  sortBy, 
  setSortBy,
  weeks,
  currentWeek,
  setCurrentWeek
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Filter By Level</h3>
        <div className={styles.filterOptions}>
          <button 
            className={`${styles.filterButton} ${filterLevel === 'All' ? styles.active : ''}`}
            onClick={() => setFilterLevel('All')}
          >
            All Levels
          </button>
          <button 
            className={`${styles.filterButton} ${filterLevel === 'Federal' ? styles.active : ''}`}
            onClick={() => setFilterLevel('Federal')}
          >
            Federal
          </button>
          <button 
            className={`${styles.filterButton} ${filterLevel === 'State' ? styles.active : ''}`}
            onClick={() => setFilterLevel('State')}
          >
            State
          </button>
          <button 
            className={`${styles.filterButton} ${filterLevel === 'Local' ? styles.active : ''}`}
            onClick={() => setFilterLevel('Local')}
          >
            Local
          </button>
        </div>
      </div>
      
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Sort By</h3>
        <div className={styles.filterOptions}>
          <button 
            className={`${styles.filterButton} ${sortBy === 'rank' ? styles.active : ''}`}
            onClick={() => setSortBy('rank')}
          >
            Rank
          </button>
          <button 
            className={`${styles.filterButton} ${sortBy === 'policyImpact' ? styles.active : ''}`}
            onClick={() => setSortBy('policyImpact')}
          >
            Policy Impact
          </button>
          <button 
            className={`${styles.filterButton} ${sortBy === 'publicEngagement' ? styles.active : ''}`}
            onClick={() => setSortBy('publicEngagement')}
          >
            Public Engagement
          </button>
          <button 
            className={`${styles.filterButton} ${sortBy === 'coalitionBuilding' ? styles.active : ''}`}
            onClick={() => setSortBy('coalitionBuilding')}
          >
            Coalition Building
          </button>
          <button 
            className={`${styles.filterButton} ${sortBy === 'politicalCourage' ? styles.active : ''}`}
            onClick={() => setSortBy('politicalCourage')}
          >
            Political Courage
          </button>
          <button 
            className={`${styles.filterButton} ${sortBy === 'momentum' ? styles.active : ''}`}
            onClick={() => setSortBy('momentum')}
          >
            Momentum
          </button>
        </div>
      </div>
      
      {weeks && weeks.length > 0 && (
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Archive</h3>
          <select 
            className={styles.weekSelect}
            value={currentWeek}
            onChange={(e) => setCurrentWeek(e.target.value)}
          >
            {weeks.map(week => (
              <option key={week.weekStart} value={week.weekStart}>
                {week.label || `${formatDate(week.weekStart)} - ${formatDate(week.weekEnd)}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default PowerRankingsFilter;