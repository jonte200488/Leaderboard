import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    try {
      // Execute raw SQL query using Prisma
      await prisma.$executeRaw`
        INSERT INTO "Player" (name, image)
        VALUES (${name}, ${image});
      `;

      res.status(201).json({ message: 'Player added successfully' });
    } catch (error) {
      console.error('Error inserting player:', error);
      res.status(500).json({ error: 'Failed to add player', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}