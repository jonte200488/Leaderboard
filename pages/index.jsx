// /pages/index.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { fetchPlayers } from '../utils/api';
import Leaderboard from '../components/Leaderboard';
import Navbar from '../components/Navbar';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [leaderboardType, setLeaderboardType] = useState('all-time');

  useEffect(() => {
    updatePlayerList();
  }, [leaderboardType]);

  const updatePlayerList = async () => {
    const players = await fetchPlayers();
    setPlayers(players);
  };

  return (
    <div className={styles.theme-dark-blue}>
      <Navbar />
      <header className={styles.header}>
        <h1>Leaderboard</h1>
      </header>
      <main>
        <Leaderboard players={players} leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
      </main>
    </div>
  );
}