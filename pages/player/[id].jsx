import { useState, useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import { LineChart } from '@mui/x-charts/LineChart';
import Link from 'next/link';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Import the plugin

dayjs.extend(weekOfYear); // Extend dayjs with the weekOfYear plugin

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
      const week = Number(dayjs(game.date).week()); // Ensure week number is a number
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
      const averageWins = total > 0 ? (wins / total) * 100 : 0; // Ensure no division by zero
  
      return {
        week: Number(week), // Ensure week is a number
        averageWins: isNaN(averageWins) ? 0 : Math.round(averageWins), // Replace NaN with 0 and round to the nearest integer
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
  console.log(weeklyAverageWins);

  // Check if weeklyAverageWins contains valid data
  const isValidData = weeklyAverageWins.length > 0 && weeklyAverageWins.every(week => !isNaN(week.averageWins) && typeof week.averageWins === 'number');

  console.log("Weekly Average Wins Data:", weeklyAverageWins);
  weeklyAverageWins.forEach(week => {
    if (typeof week.averageWins !== 'number' || isNaN(week.averageWins)) {
      console.error(`Invalid averageWins for week ${week.week}:`, week.averageWins);
    }
  });

  // Ensure to log and validate data before using it in the LineChart
  console.log("Weekly Average Wins Data:", weeklyAverageWins);

  return (
    <div className='playerPage'>
      <Link href="/">
          <a>Back to leaderboard</a>
        </Link>
      <div className="playerContainer">
        <div className="playerHeader">
          <img src={player.image} alt={player.name} />
          <h1>{player.name}</h1>
        </div>
        {isValidData && weeklyAverageWins.length > 0 ? (
          <LineChart
            xAxis={[{ data: weeklyAverageWins.map(week => week.week) }]} // Extract week numbers directly
            series={[
              {
                data: weeklyAverageWins.map(week => week.averageWins), // Extract average wins
                area: true,
              },
            ]}
            width={1300}
            height={300}
          />
        ) : (
          <p>No valid data for chart</p>
        )}
        <div className="playerInfo">
          <p>Average Wins: <span>{player.averageWins.toFixed(0)}%</span></p>
          <p>Total Points: <span>{player.totalPoints}p</span></p>
          <p>Total Games Played: <span>{player.games1.length + player.games2.length}</span></p>
        </div>
      </div>
    </div>
  );
}