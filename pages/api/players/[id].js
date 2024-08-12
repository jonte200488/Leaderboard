import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (!parseInt(id)) {
    return res.status(400).json({ error: 'Invalid player ID' });
  }

  if (req.method === 'GET') {
    try {
      const player = await prisma.player.findUnique({
        where: { id: parseInt(id) },
        include: {
          games1: true, // Games where the player is player1
          games2: true, // Games where the player is player2
        },
      });

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      // Calculate total points
      const totalPoints = player.games1.reduce((sum, game) => sum + game.player1Points, 0) +
                          player.games2.reduce((sum, game) => sum + game.player2Points, 0);

      res.status(200).json({ ...player, totalPoints });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch player', message: error.message });
    }
  } else if (req.method === 'PUT') {
    // Handle updating a player's data
    const { name, image, points } = req.body;

    if (!name || !image || isNaN(parseInt(points))) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
      const updatedPlayer = await prisma.player.update({
        where: { id: parseInt(id) },
        data: { name, image, points: parseInt(points) },
      });

      res.status(200).json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update player', message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.player.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).end(); // No content response for successful deletion
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete player', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}