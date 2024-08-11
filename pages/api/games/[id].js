// pages/api/games/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Ensure the ID is a valid number
      const gameId = parseInt(id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      // Attempt to delete the game
      await prisma.game.delete({
        where: { id: gameId },
      });

      // Return a 204 status code indicating the resource was deleted successfully
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting game:', error.message);

      if (error.code === 'P2025') { // Prisma error code for "Record to delete does not exist"
        return res.status(404).json({ error: 'Game not found' });
      }

      // Return a 500 status code for any other errors
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}