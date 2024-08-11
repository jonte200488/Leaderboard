// /pages/index.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { fetchPlayers, addPlayer, removePlayer, fetchGames, addGame, removeGame, updatePlayerPoints } from '../utils/api';
import Leaderboard from '../components/Leaderboard';
import ManageGames from '../components/ManageGames';
import ManagePlayers from '../components/ManagePlayers';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Leaderboard');
  const [leaderboardType, setLeaderboardType] = useState('all-time');

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

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Leaderboard and Management</h1>
        <div className={styles.tab}>
          <button className={`${styles.tablinks} ${selectedTab === 'Leaderboard' ? styles.active : ''}`} onClick={() => handleTabClick('Leaderboard')}>
            Leaderboard
          </button>
          <button className={`${styles.tablinks} ${selectedTab === 'ManageGames' ? styles.active : ''}`} onClick={() => handleTabClick('ManageGames')}>
            Manage Games
          </button>
          <button className={`${styles.tablinks} ${selectedTab === 'ManagePlayers' ? styles.active : ''}`} onClick={() => handleTabClick('ManagePlayers')}>
            Manage Players
          </button>
        </div>
      </header>

      <main>
        <div className={`${styles.tabContent} ${selectedTab === 'Leaderboard' ? styles.active : ''}`}>
          <Leaderboard players={players} leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
        </div>

        <div className={`${styles.tabContent} ${selectedTab === 'ManageGames' ? styles.active : ''}`}>
          <ManageGames players={players} games={games} addGame={addGame} removeGame={removeGame} />
        </div>

        <div className={`${styles.tabContent} ${selectedTab === 'ManagePlayers' ? styles.active : ''}`}>
          <ManagePlayers players={players} addPlayer={addPlayer} removePlayer={removePlayer} />
        </div>
      </main>
    </div>
  );
}