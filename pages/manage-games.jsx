import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Games() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState(0); // Initialize with 0
  const [player2Points, setPlayer2Points] = useState(0); // Initialize with 0

  // Increment and Decrement Functions for Player 1
  const incrementPlayer1Points = () => {
    setPlayer1Points((prevPoints) => Number(prevPoints) + 1);
  };

  const decrementPlayer1Points = () => {
    setPlayer1Points((prevPoints) => prevPoints > 0 ? Number(prevPoints) - 1 : 0);
  };

  // Increment and Decrement Functions for Player 2
  const incrementPlayer2Points = () => {
    setPlayer2Points((prevPoints) => Number(prevPoints) + 1);
  };

  const decrementPlayer2Points = () => {
    setPlayer2Points((prevPoints) => prevPoints > 0 ? Number(prevPoints) - 1 : 0);
  };

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
    <div className="manageGamescontainer">
      <div className="createGameContainer">
        <h3 className="header">Add a New Game</h3>
        <form className="form" onSubmit={handleAddGame}>
          <div className="playersWrapper">
            <div className="playerSide left">
              <select
                id="player1"
                className="select"
                value={player1Id}
                onChange={(e) => setPlayer1Id(e.target.value)}
                required
              >
                <option value="">Player 1</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <div className="points-input-container" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={decrementPlayer1Points}
                  style={{
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  id="player1Points"
                  className="input"
                  placeholder="Points"
                  value={player1Points}
                  onChange={(e) => setPlayer1Points(Number(e.target.value))}
                  required
                  style={{
                    textAlign: 'center',
                    margin: '0 10px',
                    width: '60px',
                  }}
                />
                <button
                  type="button"
                  onClick={incrementPlayer1Points}
                  style={{
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="playerSide right">
              <select
                id="player2"
                className="select"
                value={player2Id}
                onChange={(e) => setPlayer2Id(e.target.value)}
                required
              >
                <option value="">Player 2</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <div className="points-input-container" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={decrementPlayer2Points}
                  style={{
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  id="player2Points"
                  className="input"
                  placeholder="Points"
                  value={player2Points}
                  onChange={(e) => setPlayer2Points(Number(e.target.value))}
                  required
                  style={{
                    textAlign: 'center',
                    margin: '0 10px',
                    width: '60px',
                  }}
                />
                <button
                  type="button"
                  onClick={incrementPlayer2Points}
                  style={{
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="addButton">Add Game</button>
        </form>
      </div>

      <div className="gamesContainer">
        <h3 className="header">Games</h3>
        <section className="gamesList">
          {games.map((game) => (
            <div key={game.id} className="gameEntry">
              <div className="gamePlayers">
                <span>{game.player1.name} {game.player1Points} - {game.player2Points} {game.player2.name}</span>
              </div>
              <button className="gameButton" onClick={() => handleDeleteGame(game.id)}>Delete Game</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}