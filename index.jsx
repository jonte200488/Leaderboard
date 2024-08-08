import { useEffect, useState } from 'react';

const API_BASE_URL = "http://localhost:3000"; // Update this with your production server URL if deployed

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Leaderboard');
  const [leaderboardType, setLeaderboardType] = useState('all-time');

  useEffect(() => {
    // Fetch initial data when component mounts
    updatePlayerList();
    updateGameList();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch(`${API_BASE_URL}/players`);
    const players = await response.json();
    return players;
  };

  const addPlayer = async (name, image) => {
    await fetch(`${API_BASE_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, image, points: 0 }),
    });
    updatePlayerList();
  };

  const removePlayer = async (playerId) => {
    await fetch(`${API_BASE_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    updatePlayerList();
  };

  const fetchGames = async () => {
    const response = await fetch(`${API_BASE_URL}/games`);
    const games = await response.json();
    return games;
  };

  const addGame = async (player1, player2, player1Points, player2Points) => {
    await fetch(`${API_BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player1, player2, player1Points, player2Points }),
    });
    updatePlayerPoints(player1, player1Points, player2, player2Points);
    updateGameList();
  };

  const updatePlayerPoints = async (player1, player1Points, player2, player2Points) => {
    const players = await fetchPlayers();

    const updatedPlayers = players.map((player) => {
      if (player.name === player1) {
        player.points += parseInt(player1Points);
      }
      if (player.name === player2) {
        player.points += parseInt(player2Points);
      }
      return player;
    });

    // Save updated players back to the backend
    await Promise.all(
      updatedPlayers.map(async (player) => {
        await fetch(`${API_BASE_URL}/players/${player._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(player),
        });
      })
    );

    updateLeaderboard('all-time');
  };

  const removeGame = async (gameId) => {
    const game = await fetch(`${API_BASE_URL}/games/${gameId}`);
    await fetch(`${API_BASE_URL}/games/${gameId}`, {
      method: "DELETE",
    });

    // Reverse the points for the players
    await updatePlayerPoints(
      game.player1,
      -game.player1Points,
      game.player2,
      -game.player2Points
    );
    updateGameList();
  };

  const updatePlayerList = async () => {
    const players = await fetchPlayers();
    setPlayers(players);
  };

  const updateGameList = async () => {
    const games = await fetchGames();
    setGames(games);
  };

  const updateLeaderboard = async (type) => {
    const players = await fetchPlayers();
    let sortedPlayers = players.sort((a, b) => b.points - a.points);

    if (type === "weekly") {
      // Implement weekly filtering if points are stored with timestamps
    }

    setPlayers(sortedPlayers);
  };

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const renderLeaderboard = () => (
    <>
      <h2>Leaderboard</h2>
      <select onChange={(e) => setLeaderboardType(e.target.value)} value={leaderboardType}>
        <option value="weekly">This Week</option>
        <option value="all-time">All Time</option>
      </select>
      <section id="podium">
        {players.slice(0, 3).map((player, index) => (
          <div key={player._id} className={`podium-position podium-${index + 1}`}>
            <img src={player.image} alt={player.name} className="player-image podium-image" />
            <div className="player-name">{player.name}</div>
            <div className="player-points">{player.points} Points</div>
          </div>
        ))}
      </section>
      <section id="otherPlayers">
        {players.slice(3).map((player) => (
          <div key={player._id} className="player-entry">
            <img src={player.image} alt={player.name} className="player-image" />
            <span>{player.name}</span>
            <span>{player.points} Points</span>
          </div>
        ))}
      </section>
    </>
  );

  const renderManageGames = () => (
    <>
      <h2>Manage Games</h2>
      <form id="newGameForm" onSubmit={async (e) => {
        e.preventDefault();
        const player1 = document.getElementById('player1').value;
        const player1Points = document.getElementById('player1Points').value;
        const player2 = document.getElementById('player2').value;
        const player2Points = document.getElementById('player2Points').value;

        if (player1 === '' || player2 === '') {
          console.error('Both players must be selected');
          return;
        }

        await addGame(player1, player2, player1Points, player2Points);
        updateGameList();
      }}>
        <label htmlFor="player1">Player 1:</label>
        <select id="player1">
          <option value="">Select Player 1</option>
          {players.map(player => <option key={player._id} value={player.name}>{player.name}</option>)}
        </select>
        <input type="number" id="player1Points" placeholder="Player 1 Points" />

        <label htmlFor="player2">Player 2:</label>
        <select id="player2">
          <option value="">Select Player 2</option>
          {players.map(player => <option key={player._id} value={player.name}>{player.name}</option>)}
        </select>
        <input type="number" id="player2Points" placeholder="Player 2 Points" />

        <button type="submit">Create Game</button>
      </form>
      <section id="gamesList">
        {games.map((game) => (
          <div key={game._id}>
            {game.player1} vs {game.player2}: {game.player1Points} - {game.player2Points}
            <button onClick={() => removeGame(game._id)}>Remove</button>
          </div>
        ))}
      </section>
    </>
  );

  const renderManagePlayers = () => (
    <>
      <h2>Manage Players</h2>
      <form id="newPlayerForm" onSubmit={async (e) => {
        e.preventDefault();
        const playerName = document.getElementById('playerName').value;
        const playerImage = document.getElementById('playerImage').value || "default-image-url.jpg";
        await addPlayer(playerName, playerImage);
      }}>
        <input type="text" id="playerName" placeholder="Player Name" />
        <input type="text" id="playerImage" placeholder="Profile Image URL" />
        <button type="submit">Add Player</button>
      </form>
      <section id="playersList">
        {players.map((player) => (
          <div key={player._id}>
            <img src={player.image} alt={player.name} className="player-image" />
            {player.name}
            <button onClick={() => removePlayer(player._id)}>Remove</button>
          </div>
        ))}
      </section>
    </>
  );

  return (
    <div>
      <header>
        <h1>Leaderboard and Management</h1>
        <div className="tab">
          <button className={`tablinks ${selectedTab === 'Leaderboard' ? 'active' : ''}`} onClick={() => handleTabClick('Leaderboard')}>
            Leaderboard
          </button>
          <button className={`tablinks ${selectedTab === 'ManageGames' ? 'active' : ''}`} onClick={() => handleTabClick('ManageGames')}>
            Manage Games
          </button>
          <button className={`tablinks ${selectedTab === 'ManagePlayers' ? 'active' : ''}`} onClick={() => handleTabClick('ManagePlayers')}>
            Manage Players
          </button>
        </div>
      </header>

      <main>
      <div className={`tab-content ${selectedTab === 'Leaderboard' ? 'active' : ''}`}>
          {renderLeaderboard()}
        </div>

        <div className={`tab-content ${selectedTab === 'ManageGames' ? 'active' : ''}`}>
          {renderManageGames()}
        </div>

        <div className={`tab-content ${selectedTab === 'ManagePlayers' ? 'active' : ''}`}>
          {renderManagePlayers()}
        </div>
      </main>

      <style jsx>{`
        /* Add your styles here or link to an external stylesheet */
        header {
          text-align: center;
          margin-bottom: 20px;
        }

        .tab {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .tab button {
          padding: 10px 20px;
          cursor: pointer;
          background-color: #f1f1f1;
          border: 1px solid #ccc;
          margin: 0 5px;
          border-radius: 5px;
        }

        .tab button.active {
          background-color: #ccc;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        /* Add styles for your forms, podium, and other elements */
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        input[type="text"], input[type="number"], select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 10px 20px;
          cursor: pointer;
          background-color: #28a745;
          border: none;
          border-radius: 5px;
          color: white;
        }

        button:hover {
          background-color: #218838;
        }

        #podium, #otherPlayers, #gamesList, #playersList {
          margin-top: 20px;
        }

        .podium-position {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .player-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .podium-image {
          width: 80px;
          height: 80px;
        }

        .player-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}