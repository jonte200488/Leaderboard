// /pages/manage-games.js

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';

export default function Games() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState('');
  const [player2Points, setPlayer2Points] = useState('');

  useEffect(() => {
    fetchGames();
    fetchPlayers();
  }, []);

  const fetchGames = async () => {
    const response = await fetch('/api/games');
    const data = await response.json();
    setGames(data);
  };

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    const data = await response.json();
    setPlayers(data);
  };

  const handleAddGame = async () => {
    const data = {
      player1Id: parseInt(player1Id),
      player2Id: parseInt(player2Id),
      player1Points: parseInt(player1Points),
      player2Points: parseInt(player2Points),
    };

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newGame = await response.json();
      setGames([...games, newGame]); // Add the new game to the state

      // Optionally, update the players list to reflect the updated points
      fetchPlayers();

    } catch (error) {
      console.error('Error adding game:', error);
    }
    window.location.reload();
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the game from the state
      setGames(games.filter(game => game.id !== gameId));

      // Optionally, update the players list to reflect the updated points
      fetchPlayers();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  return (
    <div className={container}>
      <Navbar />
      <header className={header}></header>
      <h2 className={header}>Games</h2>

      <section className={gamesList}>
        {games.map((game) => (
          <div key={game.id} className={gameEntry}>
            <div className={gamePlayers}>
              <span>{game.player1.name} vs {game.player2.name}</span>
            </div>
            <div className={gamePoints}>
              <span>{game.player1.name}: {game.player1Points} points</span>
              <span>{game.player2.name}: {game.player2Points} points</span>
            </div>
            <button className={gameButton} onClick={() => handleDeleteGame(game.id)}>Delete Game</button>
          </div>
        ))}
      </section>

      <h3 className={header}>Add a New Game</h3>
      <div className={formContainer}>
        <label className={formLabel} htmlFor="player1">Player 1:</label>
        <select
          id="player1"
          className={formSelect}
          value={player1Id}
          onChange={(e) => setPlayer1Id(e.target.value)}
        >
          <option value="">Select Player 1</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <label className={styles.formLabel} htmlFor="player1Points">Player 1 Points:</label>
        <input
          type="number"
          id="player1Points"
          className={styles.formInput}
          placeholder="Player 1 Points"
          value={player1Points}
          onChange={(e) => setPlayer1Points(e.target.value)}
        />

        <label className={styles.formLabel} htmlFor="player2">Player 2:</label>
        <select
          id="player2"
          className={styles.formSelect}
          value={player2Id}
          onChange={(e) => setPlayer2Id(e.target.value)}
        >
          <option value="">Select Player 2</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <label className={styles.formLabel} htmlFor="player2Points">Player 2 Points:</label>
        <input
          type="number"
          id="player2Points"
          className={styles.formInput}
          placeholder="Player 2 Points"
          value={player2Points}
          onChange={(e) => setPlayer2Points(e.target.value)}
        />

        <button className={styles.formButton} onClick={handleAddGame}>Add Game</button>
      </div>
    </div>
  );
}