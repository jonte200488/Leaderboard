// /pages/manage-games.js

import { useEffect, useState } from 'react';
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
    <div className="container">
      <Navbar />
      <header className="header"></header>

      <h3 className="header">Add a New Game</h3>
      <form className="form" onSubmit={handleAddGame}>
        <div className="playersWrapper">
          <div className="playerSide">
            <label className="label" htmlFor="player1">Player 1:</label>
            <select
              id="player1"
              className="select"
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              required
            >
              <option value="">Select Player 1</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>

            <label className="label" htmlFor="player1Points">Player 1 Points:</label>
            <input
              type="number"
              id="player1Points"
              className="input"
              placeholder="Player 1 Points"
              value={player1Points}
              onChange={(e) => setPlayer1Points(e.target.value)}
              required
            />
          </div>

          <div className="versusImage">
            <img src="https://media.istockphoto.com/id/904853290/sv/foto/bordtennisbord-isolerade.jpg?s=612x612&w=0&k=20&c=1g1k7fej4i4xp8ZQ2OuevOLH7aYdcHyS6G7bvAs9pJQ=" alt="Versus" className="versusImg" />
          </div>

          <div className="playerSide">
            <label className="label" htmlFor="player2">Player 2:</label>
            <select
              id="player2"
              className="select"
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              required
            >
              <option value="">Select Player 2</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>

            <label className="label" htmlFor="player2Points">Player 2 Points:</label>
            <input
              type="number"
              id="player2Points"
              className="input"
              placeholder="Player 2 Points"
              value={player2Points}
              onChange={(e) => setPlayer2Points(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="addButton">Add Game</button>
      </form>

      <h2 className="header">Games</h2>

      <section className="gamesList">
        {games.map((game) => (
          <div key={game.id} className="gameEntry">
            <div className="gamePlayers">
              <span>{game.player1.name} vs {game.player2.name}</span>
            </div>
            <div className="gamePoints">
              <span>{game.player1.name}: {game.player1Points} points</span>
              <span>{game.player2.name}: {game.player2Points} points</span>
            </div>
            <button className="gameButton" onClick={() => handleDeleteGame(game.id)}>Delete Game</button>
          </div>
        ))}
      </section>
    </div>
  );
}