import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const players = await prisma.player.findMany({
        include: {
          games1: true, // Games where the player is player1
          games2: true, // Games where the player is player2
        },
      });

      // Calculate total points for each player
      const playersWithTotalPoints = players.map(player => {
        // Sum up the points for games where the player is player1
        const totalPointsAsPlayer1 = player.games1.reduce((sum, game) => sum + game.player1Points, 0);

        // Sum up the points for games where the player is player2
        const totalPointsAsPlayer2 = player.games2.reduce((sum, game) => sum + game.player2Points, 0);

        // Total points is the sum of both
        const totalPoints = totalPointsAsPlayer1 + totalPointsAsPlayer2;

        // Assuming player.games1 and player.games2 contain information about each game's result
        const totalGamesPlayed = player.games1.length + player.games2.length;

        // Calculate total wins from games1 and games2
        const totalWins = player.games1.filter(game => game.isWin).length + player.games2.filter(game => game.isWin).length;

        // Calculate average wins per game
        const averageWins = totalGamesPlayed > 0 ? totalWins / totalGamesPlayed : 0;

        return {
          ...player,
          totalPoints,
          averageWins,
        };
      });

      res.status(200).json(playersWithTotalPoints);
    } catch (error) {
      console.error('Error fetching players:', error.message);
      res.status(500).json({ error: 'Failed to fetch players', message: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle creating a new player
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    try {
      const newPlayer = await prisma.player.create({
        data: { name, image },
      });
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Failed to create player', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}