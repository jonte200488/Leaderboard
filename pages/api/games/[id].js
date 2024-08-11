// /pages/api/games/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Find the game to be deleted to get the points for both players
      const game = await prisma.game.findUnique({
        where: { id: parseInt(id) },
        include: {
          player1: true,
          player2: true,
        },
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Delete the game
      await prisma.game.delete({
        where: { id: parseInt(id) },
      });

      // Subtract the points from the players' totals
      await prisma.player.update({
        where: { id: game.player1Id },
        data: {
          points: {
            decrement: game.player1Points,
          },
        },
      });

      await prisma.player.update({
        where: { id: game.player2Id },
        data: {
          points: {
            decrement: game.player2Points,
          },
        },
      });

      res.status(204).end(); // No content response for successful deletion
    } catch (error) {
      console.error('Error deleting game and updating points:', error.message);
      if (error.code === 'P2025') { // Prisma error code for "Record to delete does not exist"
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}