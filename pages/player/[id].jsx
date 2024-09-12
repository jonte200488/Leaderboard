import { useState, useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import { LineChart } from '@mui/x-charts/LineChart';
import Link from 'next/link';
import dayjs from 'dayjs'; // A lightweight date library to help with week calculations.

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL

  const [player, setPlayer] = useState(null); // Player data
  const [loading, setLoading] = useState(true); // Loading state
  const [weeklyAverageWins, setWeeklyAverageWins] = useState([]); // Average wins per week

  useEffect(() => {
    if (id) {
      fetchPlayer(); // Fetch the player data when the ID is available
    }
  }, [id]);

  const fetchPlayer = async () => {
    try {
      const response = await fetch(`/api/players`);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }

      const data = await response.json(); // Parse the JSON response
      const player = data.find((player) => player.id === Number(id));

      if (player) {
        setPlayer(player); // Set the player's data
        calculateWeeklyAverageWins(player); // Calculate weekly average wins
      } else {
        console.error('Player not found');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const calculateWeeklyAverageWins = (player) => {
    const games = [...player.games1, ...player.games2]; // Combine games1 and games2
    const weeks = {};

    games.forEach((game) => {
      const week = dayjs(game.date).week(); // Get the week number of the year
      if (!weeks[week]) {
        weeks[week] = { wins: 0, total: 0 };
      }

      if (game.player1Id === player.id && game.player1Points > game.player2Points) {
        weeks[week].wins += 1;
      }
      if (game.player2Id === player.id && game.player2Points > game.player1Points) {
        weeks[week].wins += 1;
      }

      weeks[week].total += 1; // Count each game
    });

    const weeklyData = Object.keys(weeks).map((week) => {
      const { wins, total } = weeks[week];
      const averageWins = (wins / total) * 100; // Calculate average win percentage for the week
      return {
        week: Number(week), // Week number
        averageWins: averageWins || 0, // Avoid NaN if no games were played
      };
    });

    setWeeklyAverageWins(weeklyData);
  };

  // Handle loading state
  if (loading) {
    return <div>Loading player data...</div>;
  }

  // Handle if player data is not found
  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div>
      <h1>{player.name}</h1> {/* Correctly access player object properties */}
      <img src={player.image} alt={player.name} />
      <p>Average Wins: {player.averageWins}%</p>
      <p>Total Points: {player.totalPoints}p</p>
      <p>Total Games Played: {player.games1.length + player.games2.length}</p>

      <LineChart
        xAxis={[{ data: weeklyAverageWins.map(week => `Week ${week.week}`) }]} // Label each week
        series={[
          {
            data: weeklyAverageWins.map(week => week.averageWins), // Plot average wins per week
            label: 'Average Wins %',
          },
        ]}
        width={500}
        height={300}
      />

      <Link href="/">
        <a>Back to leaderboard</a>
      </Link>
    </div>
  );
}