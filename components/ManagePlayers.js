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
    try {
      const response = await fetch('/api/player');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        console.error('Failed to fetch players');
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();

    if (!playerName.trim() || !playerImage.trim()) {
      console.error('Player name or image is empty');
      return;
    }

    console.log('Adding player:', playerName, playerImage); // Debugging output

    try {
      const response = await fetch('/api/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName, image: playerImage }),
      });

      if (response.ok) {
        const newPlayer = await response.json();
        console.log('Player added successfully:', newPlayer); // Debugging output
        setPlayers([...players, newPlayer]);
        setPlayerName('');
        setPlayerImage('');
      } else {
        console.error('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    try {
      const response = await fetch(`/api/player/${playerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlayers(players.filter(player => player.id !== playerId));
      } else {
        console.error('Failed to remove player');
      }
    } catch (error) {
      console.error('Error removing player:', error);
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