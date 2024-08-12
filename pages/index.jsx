// /pages/index.js

import { useEffect, useState } from 'react';
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
    <div className="theme">
      <Navbar />
      <main>
        <Leaderboard players={players} leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
      </main>
    </div>
  );
}