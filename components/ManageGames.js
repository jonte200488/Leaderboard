import React, { useState, useEffect } from 'react';

const AddGame = () => {
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState('');
  const [player2Points, setPlayer2Points] = useState('');

  useEffect(() => {
    // Fetch players when the component loads
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

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

      const result = await response.json();
      console.log('Game added successfully:', result);
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  return (
    <div>
      <h2>Add Game</h2>

      <label htmlFor="player1">Player 1:</label>
      <select
        id="player1"
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

      <label htmlFor="player1Points">Player 1 Points:</label>
      <input
        type="number"
        id="player1Points"
        placeholder="Player 1 Points"
        value={player1Points}
        onChange={(e) => setPlayer1Points(e.target.value)}
      />

      <label htmlFor="player2">Player 2:</label>
      <select
        id="player2"
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

      <label htmlFor="player2Points">Player 2 Points:</label>
      <input
        type="number"
        id="player2Points"
        placeholder="Player 2 Points"
        value={player2Points}
        onChange={(e) => setPlayer2Points(e.target.value)}
      />

      <button onClick={handleAddGame}>Add Game</button>
    </div>
  );
};

export default AddGame;