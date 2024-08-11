// /pages/api/players.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, image } = req.body;
      const newPlayer = await prisma.player.create({
        data: {
          name,
          image,
          points: 0,
        },
      });
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error('Error creating player:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}