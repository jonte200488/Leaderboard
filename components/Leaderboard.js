import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeRange, setTimeRange] = useState('all'); // 'today' or 'all'
  const router = useRouter();

  // Define constants for Bayesian Average calculation
  const GLOBAL_WIN_RATE = 0.5; // Neutral global win rate or calculated across all players
  const SMOOTHING_FACTOR = 10; // The higher this is, the less impact few games have

  useEffect(() => {
    fetchPlayers();
  }, [timeRange]); // Refetch when timeRange changes

  const fetchPlayers = async () => {
    const response = await fetch(`/api/players?timeRange=${timeRange}`);
    const data = await response.json();
  
    // Calculate Bayesian Average for each player
    const playersWithBayesianAvg = data.map(player => {
      const wins = player.wins || 0;
      const gamesPlayed = player.gamesPlayed || 0;
  
      // Player's win rate (W)
      let playerWinRate = 0;
      if (gamesPlayed > 0) {
        playerWinRate = wins / gamesPlayed;
      }
  
      // Handle edge case: if a player has played no games
      const bayesianAverage = (playerWinRate * gamesPlayed + GLOBAL_WIN_RATE * SMOOTHING_FACTOR) / (gamesPlayed + SMOOTHING_FACTOR);
  
      console.log(`Player: ${player.name}, Wins: ${wins}, Games Played: ${gamesPlayed}, Win Rate: ${playerWinRate}, Bayesian Average: ${bayesianAverage}`);
  
      return { ...player, bayesianAverage }; // Add bayesianAverage to each player object
    });
  
    // Sort players by Bayesian Average in descending order
    playersWithBayesianAvg.sort((a, b) => b.bayesianAverage - a.bayesianAverage);
  
    setPlayers(playersWithBayesianAvg);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range); // Change the time range
  };

  return (
    <div>
      <div className="leaderboardContainer">
        <div>
          <div className="timeRangeToggle">
            <button
              className={timeRange === 'all' ? 'active' : ''}
              onClick={() => handleTimeRangeChange('all')}>
              All Time
            </button>
            <button
              className={timeRange === 'today' ? 'active' : ''}
              onClick={() => handleTimeRangeChange('today')}>
              This week
            </button>
          </div>
          <section id="podium" className="podium">
            {players.length >= 3 && (
              <>
                <div key={players[1].id} className="podiumWrapper">
                  <div className="podiumPosition podium-2">
                    <Link href={`/player/${players[1].id}`}>
                      <a>
                        <img src={players[1].image} alt={players[1].name} className="podiumImage" />
                        <div className="playerName">{players[1].name}</div>
                        <div className="playerPoints">{(players[1].bayesianAverage * 100).toFixed(0)}%</div>
                        <div className="playerTotalPoints">{players[1].totalPoints}p</div>
                      </a>
                    </Link>
                  </div>
                </div>
                <div key={players[0].id} className="podiumPosition podium-1">
                  <Link href={`/player/${players[0].id}`}>
                    <a>
                      <img src={players[0].image} alt={players[0].name} className="podiumImage" />
                      <div className="playerName">{players[0].name}</div>
                      <div className="playerPoints">{(players[0].bayesianAverage * 100).toFixed(0)}%</div>
                      <div className="playerTotalPoints">{players[0].totalPoints}p</div>
                    </a>
                  </Link>
                </div>
                <div key={players[2].id} className="podiumPosition podium-3">
                  <Link href={`/player/${players[2].id}`}>
                    <a>
                      <img src={players[2].image} alt={players[2].name} className="podiumImage" />
                      <div className="playerName">{players[2].name}</div>
                      <div className="playerPoints">{(players[2].bayesianAverage * 100).toFixed(0)}%</div>
                      <div className="playerTotalPoints">{players[2].totalPoints}p</div>
                    </a>
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
        <div className="otherSide">
          <nav className="navbar">
            {/* Add navigation links here */}
          </nav>
          <section id="otherPlayers" className="otherPlayers">
            {players.slice(3).map((player) => (
              <div key={player.id} className="playerEntry">
                <Link href={`/player/${player.id}`}>
                  <a>
                    <div className="playerInfo">
                      <img src={player.image} alt={player.name} className="playerImage" />
                      <span className="playerName">{player.name}</span>
                    </div>
                    <div>
                      <span className="playerPoints">{(player.bayesianAverage * 100).toFixed(0)}% </span>
                      <span className="playerTotalPoints">{player.totalPoints}p</span>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}