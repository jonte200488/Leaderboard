// /utils/api.js

const API_BASE_URL = "http://localhost:3000"; // Update this with your production server URL if deployed

export const fetchPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  return await response.json();
};

export const addPlayer = async (name, image) => {
  await fetch(`${API_BASE_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image, points: 0 }),
  });
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