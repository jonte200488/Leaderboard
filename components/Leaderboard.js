import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeRange, setTimeRange] = useState('all'); // 'today' or 'all'

  useEffect(() => {
    fetchPlayers();
  }, [timeRange]); // Refetch when timeRange changes

  const fetchPlayers = async () => {
    const response = await fetch(`/api/players?timeRange=${timeRange}`);
    const data = await response.json();

    // Ensure the players are sorted by averagePoints in descending order
    data.sort((a, b) => b.averageWins - a.averageWins);

    setPlayers(data);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range); // Change the time range
  };

  return (
    <div>
      <div class="leaderboardContainer">
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
                        <div className="playerPoints">{players[1].averageWins.toFixed(0)}%</div>
                        <div className="playerTotalPoints">{players[1].totalPoints}p</div>
                      </a>
                    </Link>
                  </div>
                  <div className="tooltip">
                    Total Points: {players[1].totalPoints}
                  </div>
                </div>
                <div key={players[0].id} className="podiumPosition podium-1">
                  <Link href={`/player/${players[0].id}`}>
                    <a>
                      <img src={players[0].image} alt={players[0].name} className="podiumImage" />
                      <div className="playerName">{players[0].name}</div>
                      <div className="playerPoints">{players[0].averageWins.toFixed(0)}%</div>
                      <div className="playerTotalPoints">{players[0].totalPoints}p</div>
                    </a>
                  </Link>
                </div>
                <div key={players[2].id} className="podiumPosition podium-3">
                  <Link href={`/player/${players[2].id}`}>
                    <a>
                      <img src={players[2].image} alt={players[2].name} className="podiumImage" />
                      <div className="playerName">{players[2].name}</div>
                      <div className="playerPoints">{players[2].averageWins.toFixed(0)}%</div>
                      <div className="playerTotalPoints">{players[2].totalPoints}p</div>
                    </a>
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
        <section id="otherPlayers" className="otherPlayers">
          <nav className="navbar">
            <Link href="/" passHref>
              <a className={router.pathname === '/' ? 'active' : ''}>Leaderboard</a>
            </Link>
            <Link href="/manage-games" passHref>
              <a className={router.pathname === '/manage-games' ? 'active' : ''}>Manage Games</a>
            </Link>
            <Link href="/manage-players" passHref>
              <a className={router.pathname === '/manage-players' ? 'active' : ''}>Manage Players</a>
            </Link>
          </nav>
          {players.slice(3).map((player) => (
            <div key={player.id} className="playerEntry">
              <Link href={`/player/${player.id}`}>
                <a>
                  <div className="playerInfo">
                    <img src={player.image} alt={player.name} className="playerImage" />
                    <span className="playerName">{player.name}</span>
                  </div>
                  <div>
                    <span className="playerPoints">{player.averageWins.toFixed(0)}% </span>
                    <span className="playerTotalPoints">{player.totalPoints}p</span>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}