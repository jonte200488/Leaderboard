// /components/Leaderboard.js

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [leaderboardType, setLeaderboardType] = useState('all-time');

  useEffect(() => {
    fetchPlayers();
  }, [leaderboardType]);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    let data = await response.json();

    // Sort players by points in descending order
    data = data.sort((a, b) => b.points - a.points);

    setPlayers(data);
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <select
        onChange={(e) => setLeaderboardType(e.target.value)}
        value={leaderboardType}
        className={styles.select}
      >
        <option value="all-time">All Time</option>
        {/* If you had a weekly points system, you'd filter accordingly here */}
        {/* <option value="weekly">This Week</option> */}
      </select>
      <section id="podium" className={styles.podium}>
        {players.slice(0, 3).map((player, index) => (
          <div key={player.id} className={`${styles.podiumPosition} ${styles[`podium-${index + 1}`]}`}>
            <img src={player.image} alt={player.name} className={styles.podiumImage} />
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.playerPoints}>{player.points} Points</div>
          </div>
        ))}
      </section>
      <section id="otherPlayers" className={styles.otherPlayers}>
        {players.slice(3).map((player) => (
          <div key={player.id} className={styles.playerEntry}>
            <img src={player.image} alt={player.name} className={styles.playerImage} />
            <span>{player.name}</span>
            <span>{player.points} Points</span>
          </div>
        ))}
      </section>
    </div>
  );
}