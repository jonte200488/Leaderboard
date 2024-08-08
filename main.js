// API Endpoints (assuming you're running the backend locally)
const API_BASE_URL = "http://localhost:3000"; // Update this with your production server URL if deployed

// Fetch all players from the backend
async function fetchPlayers() {
  const response = await fetch(`${API_BASE_URL}/players`);
  const players = await response.json();
  return players;
}

// Add a new player to the backend
async function addPlayer(name, image) {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image, points: 0 }),
  });
  const player = await response.json();
  updatePlayerList();
  populatePlayerDropdowns();
}

// Remove a player from the backend
async function removePlayer(playerId) {
  await fetch(`${API_BASE_URL}/players/${playerId}`, {
    method: "DELETE",
  });
  updatePlayerList();
  populatePlayerDropdowns();
  updateLeaderboard("all-time");
}

// Fetch all games from the backend
async function fetchGames() {
  const response = await fetch(`${API_BASE_URL}/games`);
  const games = await response.json();
  return games;
}

// Add a new game to the backend
async function addGame(player1, player2, player1Points, player2Points) {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ player1, player2, player1Points, player2Points }),
  });
  const game = await response.json();
  updatePlayerPoints(player1, player1Points, player2, player2Points);
  updateGameList();
}

// Update player points after a game is added
async function updatePlayerPoints(
  player1,
  player1Points,
  player2,
  player2Points
) {
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

  updateLeaderboard("all-time");
}

// Remove a game from the backend
async function removeGame(gameId) {
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
  updateLeaderboard("all-time");
}

// Populate player dropdowns in the Manage Games section
async function populatePlayerDropdowns() {
  const players = await fetchPlayers();
  const player1Dropdown = document.getElementById("player1");
  const player2Dropdown = document.getElementById("player2");

  if (player1Dropdown && player2Dropdown) {
    player1Dropdown.innerHTML = '<option value="">Select Player 1</option>';
    player2Dropdown.innerHTML = '<option value="">Select Player 2</option>';

    players.forEach((player) => {
      const option1 = document.createElement("option");
      option1.value = player.name;
      option1.textContent = player.name;
      player1Dropdown.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = player.name;
      option2.textContent = player.name;
      player2Dropdown.appendChild(option2);
    });
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async function () {
  document
    .getElementById("newPlayerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const playerName = document.getElementById("playerName").value;
      const playerImage =
        document.getElementById("playerImage").value || "default-image-url.jpg"; // Add a default image if none is provided
      await addPlayer(playerName, playerImage);
    });

  document
    .getElementById("newGameForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const player1 = document.getElementById("player1").value;
      const player1Points = document.getElementById("player1Points").value;
      const player2 = document.getElementById("player2").value;
      const player2Points = document.getElementById("player2Points").value;

      if (player1 === "" || player2 === "") {
        console.error("Both players must be selected");
        return;
      }

      await addGame(player1, player2, player1Points, player2Points);
      updateGameList();
    });

  document
    .getElementById("leaderboardType")
    .addEventListener("change", function () {
      updateLeaderboard(this.value);
    });

  // Initialize lists and dropdowns
  await updatePlayerList();
  await updateGameList();
  await populatePlayerDropdowns();
  updateLeaderboard(document.getElementById("leaderboardType").value);
});

async function updatePlayerList() {
  const players = await fetchPlayers();
  const playersList = document.getElementById("playersList");
  if (playersList) {
    playersList.innerHTML = "";
    players.forEach((player) => {
      playersList.innerHTML += `
                <div>
                    <img src="${player.image}" alt="${player.name}" class="player-image">
                    ${player.name} 
                    <button onclick="removePlayer('${player._id}')">Remove</button>
                </div>`;
    });
  }
}

async function updateGameList() {
  const games = await fetchGames();
  const gamesList = document.getElementById("gamesList");
  if (gamesList) {
    gamesList.innerHTML = "";
    games.forEach((game, index) => {
      gamesList.innerHTML += `
                <div>
                    ${game.player1} vs ${game.player2}: ${game.player1Points} - ${game.player2Points} 
                    <button onclick="removeGame('${game._id}')">Remove</button>
                </div>`;
    });
  }
}

// Main function to update leaderboard based on the type
async function updateLeaderboard(type) {
  const players = await fetchPlayers();
  let sortedPlayers = players.sort((a, b) => b.points - a.points);

  if (type === "weekly") {
    // Implement weekly filtering if points are stored with timestamps
  }

  updateLeaderboardUI(sortedPlayers);
}

// Define the updateLeaderboardUI function
function updateLeaderboardUI(sortedPlayers) {
  const podium = document.getElementById("podium");
  const otherPlayers = document.getElementById("otherPlayers");

  // Clear existing UI
  podium.innerHTML = "";
  otherPlayers.innerHTML = "";

  // Top 3 Players on Podium
  sortedPlayers.slice(0, 3).forEach((player, index) => {
    podium.innerHTML += `
            <div class="podium-position podium-${index + 1}">
                <img src="${player.image}" alt="${
      player.name
    }" class="player-image podium-image">
                <div class="player-name">${player.name}</div>
                <div class="player-points">${player.points} Points</div>
            </div>
        `;
  });

  // Other players below podium
  sortedPlayers.slice(3).forEach((player) => {
    otherPlayers.innerHTML += `
            <div class="player-entry">
                <img src="${player.image}" alt="${player.name}" class="player-image">
                <span>${player.name}</span>
                <span>${player.points} Points</span>
            </div>
        `;
  });
}
