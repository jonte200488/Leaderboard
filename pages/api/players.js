import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { timeRange } = req.query; // Get the timeRange from the query parameters

    try {
      // Get the current date
      const now = new Date();
      let startOfWeek;

      // If the time range is 'today', calculate the start of the day for filtering today's games
      if (timeRange === 'today') {
        const dayOfWeek = now.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
        const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Calculate how far back Monday is (Sunday needs special treatment)
        startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday); // Get the start of the week (Monday)
        startOfWeek.setHours(0, 0, 0, 0); // Set the time to midnight to get all games from that day onwards
      }

      // Fetch players along with their games
      const players = await prisma.player.findMany({
        include: {
          games1: {
            where: timeRange === 'today' ? { date: { gte: startOfWeek } } : {},
          },
          games2: {
            where: timeRange === 'today' ? { date: { gte: startOfWeek } } : {},
          },
        },
      });

      // Calculate total points and wins for each player based on the filtered games
      const playersWithTotalPoints = players.map((player) => {
        // Sum up the points for games where the player is player1
        const totalPointsAsPlayer1 = player.games1.reduce((sum, game) => sum + game.player1Points, 0);

        // Sum up the points for games where the player is player2
        const totalPointsAsPlayer2 = player.games2.reduce((sum, game) => sum + game.player2Points, 0);

        // Total points is the sum of both
        const totalPoints = totalPointsAsPlayer1 + totalPointsAsPlayer2;

        // Calculate total games played
        const totalGamesPlayed = player.games1.length + player.games2.length;

        // Calculate total wins (assuming player wins if they are player1)
        const totalWins = player.games1.filter(game => game.player1Points > game.player2Points).length;

        // Calculate average wins per game
        const averageWins = totalGamesPlayed > 0 ? (totalWins / totalGamesPlayed) * 100 : 0;

        return {
          ...player,
          totalPoints,
          averageWins,
        };
      });

      // Sort players by averageWins in descending order
      playersWithTotalPoints.sort((a, b) => b.averageWins - a.averageWins);

      res.status(200).json(playersWithTotalPoints);
    } catch (error) {
      console.error('Error fetching players:', error.message);
      res.status(500).json({ error: 'Failed to fetch players', message: error.message });
    }
  } else if (req.method === 'POST') {
    // Handle creating a new player
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    try {
      const newPlayer = await prisma.player.create({
        data: { name, image },
      });
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Failed to create player', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}