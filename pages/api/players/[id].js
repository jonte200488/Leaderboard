// /pages/api/players/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (!parseInt(id)) {
    return res.status(400).json({ error: 'Invalid player ID' });
  }

  if (req.method === 'GET') {
    // Fetch a single player by ID
    try {
      const player = await prisma.player.findUnique({
        where: { id: parseInt(id) },
      });

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.status(200).json(player);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch player', message: error.message });
    }
  } else if (req.method === 'PUT') {
    // Update a player's data
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
    // Delete a player by ID
    try {
      await prisma.player.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).end(); // No content response for successful deletion
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete player', message: error.message });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}