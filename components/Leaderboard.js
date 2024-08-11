// /components/Leaderboard.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Leaderboard({ players, leaderboardType, setLeaderboardType }) {
  return (
    <>
      <h2>Leaderboard</h2>
      <select onChange={(e) => setLeaderboardType(e.target.value)} value={leaderboardType}>
        <option value="weekly">This Week</option>
        <option value="all-time">All Time</option>
      </select>
      <section id="podium" className={styles.podium}>
        {players.slice(0, 3).map((player, index) => (
          <div key={player._id} className={`podium-position podium-${index + 1}`}>
            <img src={player.image} alt={player.name} className={`player-image ${styles.podiumImage}`} />
            <div className="player-name">{player.name}</div>
            <div className="player-points">{player.points} Points</div>
          </div>
        ))}
      </section>
      <section id="otherPlayers">
        {players.slice(3).map((player) => (
          <div key={player._id} className="player-entry">
            <img src={player.image} alt={player.name} className="player-image" />
            <span>{player.name}</span>
            <span>{player.points} Points</span>
          </div>
        ))}
      </section>
    </>
  );
}