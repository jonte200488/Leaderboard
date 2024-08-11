// /components/ManagePlayers.js

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [playerImage, setPlayerImage] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    if (response.ok) {
      const data = await response.json();
      setPlayers(data);
    } else {
      console.error('Failed to fetch players');
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: playerName, image: playerImage }),
    });

    if (response.ok) {
      const newPlayer = await response.json();
      setPlayers([...players, newPlayer]); // Update the state with the new player
      setPlayerName('');
      setPlayerImage('');
    } else {
      console.error('Failed to add player');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    const response = await fetch(`/api/players/${playerId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setPlayers(players.filter(player => player.id !== playerId)); // Remove the player from the state
    } else {
      console.error('Failed to remove player');
    }
  };

  return (
    <div>
      <h2>Manage Players</h2>
      <form onSubmit={handleAddPlayer} className={styles.newPlayerForm}>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Profile Image URL"
          value={playerImage}
          onChange={(e) => setPlayerImage(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Add Player</button>
      </form>
      <section id="playersList" className={styles.playersList}>
        {players.map((player) => (
          <div key={player.id} className={styles.playerEntry}>
            <img src={player.image} alt={player.name} className={styles.playerImage} />
            {player.name}
            <button onClick={() => handleRemovePlayer(player.id)} className={styles.button}>Remove</button>
          </div>
        ))}
      </section>
    </div>
  );
}