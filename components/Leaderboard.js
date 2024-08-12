import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    const data = await response.json();

    // Ensure the players are sorted by totalPoints in descending order
    data.sort((a, b) => b.totalPoints - a.totalPoints);

    setPlayers(data);
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <section id="podium" className={styles.podium}>
        {players.length >= 3 && (
          <>
            <div key={players[1].id} className={`${styles.podiumPosition} ${styles['podium-2']}`}>
              <img src={players[1].image} alt={players[1].name} className={styles.podiumImage} />
              <div className={styles.playerName}>{players[1].name}</div>
              <div className={styles.playerPoints}>{players[1].totalPoints} Points</div>
            </div>
            <div key={players[0].id} className={`${styles.podiumPosition} ${styles['podium-1']}`}>
              <img src={players[0].image} alt={players[0].name} className={styles.podiumImage} />
              <div className={styles.playerName}>{players[0].name}</div>
              <div className={styles.playerPoints}>{players[0].totalPoints} Points</div>
            </div>
            <div key={players[2].id} className={`${styles.podiumPosition} ${styles['podium-3']}`}>
              <img src={players[2].image} alt={players[2].name} className={styles.podiumImage} />
              <div className={styles.playerName}>{players[2].name}</div>
              <div className={styles.playerPoints}>{players[2].totalPoints} Points</div>
            </div>
          </>
        )}
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