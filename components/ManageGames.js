// /components/ManageGames.js

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function ManageGames() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Points, setPlayer1Points] = useState('');
  const [player2Points, setPlayer2Points] = useState('');

  useEffect(() => {
    fetchPlayers();
    fetchGames();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    const data = await response.json();
    setPlayers(data);
  };

  const fetchGames = async () => {
    const response = await fetch('/api/games');
    const data = await response.json();
    setGames(data);
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player1,
        player2,
        player1Points,
        player2Points,
      }),
    });

    if (response.ok) {
      const newGame = await response.json();
      setGames([...games, newGame]);
      setPlayer1('');
      setPlayer2('');
      setPlayer1Points('');
      setPlayer2Points('');
    }
  };

  const handleRemoveGame = async (gameId) => {
    const response = await fetch(`/api/games/${gameId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setGames(games.filter(game => game.id !== gameId));
    }
  };

  return (
    <div>
      <h2>Manage Games</h2>
      <form onSubmit={handleAddGame} className={styles.newGameForm}>
        <label>Player 1:</label>
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Player 1</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Player 1 Points"
          value={player1Points}
          onChange={(e) => setPlayer1Points(e.target.value)}
          className={styles.input}
        />

        <label>Player 2:</label>
        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Player 2</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Player 2 Points"
          value={player2Points}
          onChange={(e) => setPlayer2Points(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Create Game</button>
      </form>
      <section id="gamesList" className={styles.gamesList}>
        {games.map((game) => (
          <div key={game.id} className={styles.gameEntry}>
            {game.player1.name} vs {game.player2.name}: {game.player1Points} - {game.player2Points}
            <button onClick={() => handleRemoveGame(game.id)} className={styles.button}>Remove</button>
          </div>
        ))}
      </section>
    </div>
  );
}