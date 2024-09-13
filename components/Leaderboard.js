import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeRange, setTimeRange] = useState('all'); // 'today' or 'all'
  const router = useRouter();

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
            <Link href="/manage-games" passHref>
              <a className={router.pathname === '/manage-games' ? 'active' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 6H17C18.5913 6 20.1174 6.63214 21.2426 7.75736C22.3679 8.88258 23 10.4087 23 12C23 13.5913 22.3679 15.1174 21.2426 16.2426C20.1174 17.3679 18.5913 18 17 18C15.22 18 13.63 17.23 12.53 16H11.47C10.37 17.23 8.78 18 7 18C5.4087 18 3.88258 17.3679 2.75736 16.2426C1.63214 15.1174 1 13.5913 1 12C1 10.4087 1.63214 8.88258 2.75736 7.75736C3.88258 6.63214 5.4087 6 7 6ZM6 9V11H4V13H6V15H8V13H10V11H8V9H6ZM15.5 12C15.1022 12 14.7206 12.158 14.4393 12.4393C14.158 12.7206 14 13.1022 14 13.5C14 13.8978 14.158 14.2794 14.4393 14.5607C14.7206 14.842 15.1022 15 15.5 15C15.8978 15 16.2794 14.842 16.5607 14.5607C16.842 14.2794 17 13.8978 17 13.5C17 13.1022 16.842 12.7206 16.5607 12.4393C16.2794 12.158 15.8978 12 15.5 12ZM18.5 9C18.1022 9 17.7206 9.15804 17.4393 9.43934C17.158 9.72064 17 10.1022 17 10.5C17 10.8978 17.158 11.2794 17.4393 11.5607C17.7206 11.842 18.1022 12 18.5 12C18.8978 12 19.2794 11.842 19.5607 11.5607C19.842 11.2794 20 10.8978 20 10.5C20 10.1022 19.842 9.72064 19.5607 9.43934C19.2794 9.15804 18.8978 9 18.5 9Z" fill="white"/>
                </svg>
              </a>
            </Link>
            <Link href="/manage-players" passHref>
              <a className={router.pathname === '/manage-players' ? 'active' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21.7 13.35L20.7 14.35L18.65 12.3L19.65 11.3C19.86 11.09 20.21 11.09 20.42 11.3L21.7 12.58C21.91 12.79 21.91 13.14 21.7 13.35ZM12 18.94L18.06 12.88L20.11 14.93L14.06 21H12V18.94ZM12 14C7.58 14 4 15.79 4 18V20H10V18.11L14 14.11C13.34 14.03 12.67 14 12 14ZM12 4C10.9391 4 9.92172 4.42143 9.17157 5.17157C8.42143 5.92172 8 6.93913 8 8C8 9.06087 8.42143 10.0783 9.17157 10.8284C9.92172 11.5786 10.9391 12 12 12C13.0609 12 14.0783 11.5786 14.8284 10.8284C15.5786 10.0783 16 9.06087 16 8C16 6.93913 15.5786 5.92172 14.8284 5.17157C14.0783 4.42143 13.0609 4 12 4Z" fill="white"/>
                </svg>
              </a>
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