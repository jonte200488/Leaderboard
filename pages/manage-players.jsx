// /pages/manage-players.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { fetchPlayers, addPlayer, removePlayer } from '../utils/api';
import ManagePlayers from '../components/ManagePlayers';
import Navbar from '../components/Navbar';

export default function ManagePlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    updatePlayerList();
  }, []);

  const updatePlayerList = async () => {
    const players = await fetchPlayers();
    setPlayers(players);
  };

  return (
    <div>
      <Navbar />
      <header className={styles.header}>
        <h1>Leaderboard</h1>
      </header>
      <main>
        <ManagePlayers players={players} addPlayer={addPlayer} removePlayer={removePlayer} />
      </main>
    </div>
  );
}