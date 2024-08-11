// pages/api/players.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const players = await prisma.player.findMany();
    res.status(200).json(players);
  } else if (req.method === 'POST') {
    const { name, image } = req.body;
    const newPlayer = await prisma.player.create({
      data: {
        name,
        image,
        points: 0,
      },
    });
    res.status(201).json(newPlayer);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}