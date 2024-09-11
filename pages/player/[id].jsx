import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayer();
    }
  }, [id]);

  const fetchPlayer = async () => {
    try {
      const response = await fetch(`/api/players/${id}`);
      const data = await response.json();
      setPlayer(data);
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading player data...</div>;
  }

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div>
      <h1>{player.name}</h1>
      <img src={player.image} alt={player.name} />
      <p>Average Wins: {player.averageWins.toFixed(0)}%</p>
      <p>Total Points: {player.totalPoints}p</p>
      <Link href="/">
        <a>Back to leaderboard</a>
      </Link>
    </div>
  );
}