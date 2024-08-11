// pages/api/players/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { points } = req.body;
    const updatedPlayer = await prisma.player.update({
      where: { id: parseInt(id) },
      data: { points: parseInt(points) },
    });
    res.status(200).json(updatedPlayer);
  } else if (req.method === 'DELETE') {
    await prisma.player.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}