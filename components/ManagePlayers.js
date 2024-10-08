import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [playerImage, setPlayerImage] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
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

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName, image: playerImage }),
      });

      if (response.ok) {
        const newPlayer = await response.json();
        console.log('Player added successfully:', newPlayer);
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
      const response = await fetch(`/api/players/${playerId}`, {
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
    <div className="managePlayersContainer">
      <Link href="/">
        <a>Back to leaderboard</a>
      </Link>
      <h2>Manage Players</h2>
      <form onSubmit={handleAddPlayer} className="newPlayerForm">
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Profile Image URL"
          value={playerImage}
          onChange={(e) => setPlayerImage(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">Add Player</button>
      </form>
      <section id="playersList" className="playersList">
        {players.map((player) => (
          <div key={player.id} className="playerEntry">
            <img src={player.image} alt={player.name} className="playerImage" />
            <span className="playerName">{player.name}</span>
            <button onClick={() => handleRemovePlayer(player.id)} className="button removeButton">Remove</button>
          </div>
        ))}
      </section>
    </div>
  );
}