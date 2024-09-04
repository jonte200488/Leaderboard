import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players');
    const data = await response.json();

    // Ensure the players are sorted by averagePoints in descending order
    data.sort((a, b) => b.averageWins - a.averageWins);

    setPlayers(data);
    console.log(data);
    
  };

  return (
    <div>
      <section id="podium" className="podium">
        {players.length >= 3 && (
          <>
            <div key={players[1].id} className="podiumPosition podium-2">
              <img src={players[1].image} alt={players[1].name} className="podiumImage" />
              <div className="playerName">{players[1].name}</div>
              <div className="playerPoints">{players[1].averageWins.toFixed(0)}%</div>
              <div className="playerName">{players[1].totalPoints}</div>
            </div>
            <div key={players[0].id} className="podiumPosition podium-1">
              <img src={players[0].image} alt={players[0].name} className="podiumImage" />
              <div className="playerName">{players[0].name}</div>
              <div className="playerPoints">{players[0].averageWins.toFixed(0)}%</div>
              <div className="playerName">{players[0].totalPoints}</div>
            </div>
            <div key={players[2].id} className="podiumPosition podium-3">
              <img src={players[2].image} alt={players[2].name} className="podiumImage" />
              <div className="playerName">{players[2].name}</div>
              <div className="playerPoints">{players[2].averageWins.toFixed(0)}%</div>
              <div className="playerName">{players[2].totalPoints}</div>
            </div>
          </>
        )}
      </section>
      <section id="otherPlayers" className="otherPlayers">
        {players.slice(3).map((player) => (
          <div key={player.id} className="playerEntry">
            <div className="playerInfo">
              <img src={player.image} alt={player.name} className="playerImage" />
              <span className="playerName">{player.name}</span>
            </div>
            <span className="playerPoints">{player.averageWins.toFixed(0)}%</span>
            <span className="playerName">{player.totalPoints}</span>
          </div>
        ))}
      </section>
    </div>
  );
}