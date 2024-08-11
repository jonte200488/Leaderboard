// pages/api/games.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const games = await prisma.game.findMany({
      include: {
        player1: true,
        player2: true,
      },
    });
    res.status(200).json(games);
  } else if (req.method === 'POST') {
    const { player1, player2, player1Points, player2Points } = req.body;
    const newGame = await prisma.game.create({
      data: {
        player1: { connect: { id: player1 } },
        player2: { connect: { id: player2 } },
        player1Points: parseInt(player1Points),
        player2Points: parseInt(player2Points),
      },
    });
    res.status(201).json(newGame);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}