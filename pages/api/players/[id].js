// /pages/api/players/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (isNaN(parseInt(id))) {
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

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const updatedData = { name };

      if (image !== undefined) {
        updatedData.image = image;
      }
      if (points !== undefined) {
        if (isNaN(parseInt(points))) {
          return res.status(400).json({ error: 'Points must be a number' });
        }
        updatedData.points = parseInt(points);
      }

      const updatedPlayer = await prisma.player.update({
        where: { id: parseInt(id) },
        data: updatedData,
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