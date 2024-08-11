import React, { useState } from 'react';

const AddGame = () => {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Points, setPlayer1Points] = useState('');
  const [player2Points, setPlayer2Points] = useState('');

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
      <input
        type="number"
        placeholder="Player 1 ID"
        value={player1Id}
        onChange={(e) => setPlayer1Id(e.target.value)}
      />
      <input
        type="number"
        placeholder="Player 2 ID"
        value={player2Id}
        onChange={(e) => setPlayer2Id(e.target.value)}
      />
      <input
        type="number"
        placeholder="Player 1 Points"
        value={player1Points}
        onChange={(e) => setPlayer1Points(e.target.value)}
      />
      <input
        type="number"
        placeholder="Player 2 Points"
        value={player2Points}
        onChange={(e) => setPlayer2Points(e.target.value)}
      />
      <button onClick={handleAddGame}>Add Game</button>
    </div>
  );
};

export default AddGame;