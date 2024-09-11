import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL

  console.log(id);

  const [player, setPlayer] = useState(null); // Player data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (id) {
      fetchPlayer(); // Fetch the player data when the ID is available
    }
  }, [id]);

  const fetchPlayer = async (playerId) => {
    try {
      // Ensure the correct API endpoint path
      const response = await fetch(`/api/players`)
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }
      const data = await response.json(); // Parse the JSON response

      // Use .find() to get the player with the matching id
      const player = data.find((player) => player.id === id);

      if (player) {
        setPlayer(player); // Set the player's data
        console.log(player);
      } else {
        console.error("Player not found");
      }
      console.log(player);
      console.log(data.id);
      console.log(data);
      
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
  //if (!player) {
    //return <div>Player not found</div>;
  //}

  return (
    <div>
      <h1>{player.name}</h1> {/* Correctly access player object properties */}
      <img src={player.image} alt={player.name} />
      <p>Average Wins: {player.averageWins}%</p>
      <p>Total Points: {player.totalPoints}p</p>
      <p>Total Games Played: {player.totalGamesPlayed}</p>

      <Link href="/">
        <a>Back to leaderboard</a>
      </Link>
    </div>
  );
}