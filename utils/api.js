// /utils/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://leaderboard-eight-mu.vercel.app';

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/players`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch players:', error.message);
    throw error;
  }
};

export const addPlayer = async (name, image) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, image }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add player:', error.message);
    throw error;
  }
};

export const removePlayer = async (playerId) => {
  await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
    method: "DELETE",
  });
};

export const fetchGames = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch games:', error.message);
    throw error;
  }
};

export const addGame = async (player1Id, player2Id, player1Points, player2Points) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player1Id, player2Id, player1Points, player2Points }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add game:', error.message);
    throw error;
  }
};

export const removeGame = async (gameId) => {
  await fetch(`${API_BASE_URL}/api/games?id=${gameId}`, {
    method: "DELETE",
  });
};