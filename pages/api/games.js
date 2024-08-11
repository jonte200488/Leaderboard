// /pages/api/games.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany({
        include: {
          player1: true,
          player2: true,
        },
      });
      res.status(200).json(games);
    } catch (error) {
      console.error('Error fetching games:', error.message);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { player1Id, player2Id, player1Points, player2Points } = req.body;

      // Validate the input data
      if (
        !player1Id || !player2Id ||
        isNaN(player1Id) || isNaN(player2Id) ||
        isNaN(player1Points) || isNaN(player2Points)
      ) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const newGame = await prisma.game.create({
        data: {
          player1: { connect: { id: parseInt(player1Id, 10) } },
          player2: { connect: { id: parseInt(player2Id, 10) } },
          player1Points: parseInt(player1Points, 10),
          player2Points: parseInt(player2Points, 10),
        },
      });
      res.status(201).json(newGame);
    } catch (error) {
      console.error('Error creating game:', error.message);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      // Ensure ID is a valid integer
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      await prisma.game.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Error deleting game:', error.message);
      if (error.code === 'P2025') { // Prisma error code for "Record to delete does not exist"
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}