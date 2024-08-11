// /pages/manage-games.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { fetchPlayers, fetchGames, addGame, removeGame } from '../utils/api';
import ManageGames from '../components/ManageGames';
import Navbar from '../components/Navbar';

export default function ManageGamesPage() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    updatePlayerList();
    updateGameList();
  }, []);

  const updatePlayerList = async () => {
    const players = await fetchPlayers();
    setPlayers(players);
  };

  const updateGameList = async () => {
    const games = await fetchGames();
    setGames(games);
  };

  return (
    <div>
      <Navbar />
      <header className={styles.header}>
        <h1>Manage Games</h1>
      </header>
      <main>
        <ManageGames players={players} games={games} addGame={addGame} removeGame={removeGame} />
      </main>
    </div>
  );
}