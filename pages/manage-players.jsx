// /pages/manage-players.js

import { useEffect, useState } from 'react';
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

  const handleAddPlayer = async (name, image) => {
    const newPlayer = await addPlayer(name, image);
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const handleRemovePlayer = async (playerId) => {
    await removePlayer(playerId);
    setPlayers((prevPlayers) => prevPlayers.filter(player => player.id !== playerId));
  };

  return (
    <div>
      <Navbar />
      <main>
        <ManagePlayers
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
        />
      </main>
    </div>
  );
}