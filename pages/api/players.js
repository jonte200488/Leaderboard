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

        const totalGamesPlayed = player.games1.length + player.games2.length;

        const averagePoints = totalGamesPlayed > 0 ? totalPoints / totalGamesPlayed : 0;

        return {
          ...player,
          totalPoints,
          averagePoints,
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