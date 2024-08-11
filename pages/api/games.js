// /pages/api/games.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}