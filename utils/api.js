// /utils/api.js

// /utils/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json(); // Parse JSON if content type is application/json
    } else {
      throw new Error('Unexpected content type: Expected JSON');
    }
  } catch (error) {
    console.error('Failed to fetch players:', error.message);
    throw error;
  }
};

export const removePlayer = async (playerId) => {
  await fetch(`${API_BASE_URL}/players/${playerId}`, {
    method: "DELETE",
  });
};

export const fetchGames = async () => {
  const response = await fetch(`${API_BASE_URL}/games`);
  return await response.json();
};

export const addGame = async (player1, player2, player1Points, player2Points) => {
  await fetch(`${API_BASE_URL}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ player1, player2, player1Points, player2Points }),
  });
};

export const removeGame = async (gameId) => {
  await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: "DELETE",
  });
};

export const updatePlayerPoints = async (player1, player1Points, player2, player2Points) => {
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
};