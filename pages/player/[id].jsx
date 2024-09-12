import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL

  const [player, setPlayer] = useState(null); // Player data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (id) {
      fetchPlayer(); // Fetch the player data when the ID is available
    }
  }, [id]);

  const fetchPlayer = async () => {
    try {
      // Ensure the correct API endpoint path
      const response = await fetch(`/api/players`);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }

      const data = await response.json(); // Parse the JSON response

      // Find the player with the matching id (convert `id` from string to number for comparison)
      const player = data.find((player) => player.id === Number(id));

      if (player) {
        setPlayer(player); // Set the player's data (e.g., update state or display the player)
      } else {
        console.error('Player not found');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false); // End loading state
    }
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
      <p>Total Games Played: {player.totalGamesPlayed}</p> {/* Assuming this data exists */}

      <LineChart
        xAxis={[{ data: [0, 10, 20, 30, 50, 80, 100] }]}
        series={[
          {
            data: [20, 55, 20, 85, 15, 50],
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