// /components/Leaderboard.js

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    let data = await response.json();

    // Sort players by their dynamically calculated total points
    data = data.sort((a, b) => b.totalPoints - a.totalPoints);

    setPlayers(data);
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <section id="podium" className={styles.podium}>
        {players.slice(0, 3).map((player, index) => (
          <div key={player.id} className={`${styles.podiumPosition} ${styles[`podium-${index + 1}`]}`}>
            <img src={player.image} alt={player.name} className={styles.podiumImage} />
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.playerPoints}>{player.totalPoints} Points</div>
          </div>
        ))}
      </section>
      <section id="otherPlayers" className={styles.otherPlayers}>
        {players.slice(3).map((player) => (
          <div key={player.id} className={styles.playerEntry}>
            <img src={player.image} alt={player.name} className={styles.playerImage} />
            <span>{player.name}</span>
            <span>{player.totalPoints} Points</span>
          </div>
        ))}
      </section>
    </div>
  );
}