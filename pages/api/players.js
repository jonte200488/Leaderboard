// /pages/api/players.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const players = await prisma.player.findMany({
      include: {
        games1: true, // Games where the player is player1
        games2: true, // Games where the player is player2
      },
    });

    // Calculate total points for each player
    const playersWithTotalPoints = players.map(player => {
      const totalPoints = player.games1.reduce((sum, game) => sum + game.player1Points, 0) +
                         player.games2.reduce((sum, game) => sum + game.player2Points, 0);

      return {
        ...player,
        totalPoints,
      };
    });

    res.status(200).json(playersWithTotalPoints);
  } catch (error) {
    console.error('Error fetching players:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}