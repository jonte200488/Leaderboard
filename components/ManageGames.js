// /components/ManageGames.js

import styles from '../styles/Home.module.css';

export default function ManageGames({ players, games, addGame, removeGame }) {
  return (
    <>
      <h2>Manage Games</h2>
      <form id="newGameForm" className={styles.newGameForm} onSubmit={async (e) => {
        e.preventDefault();
        const player1 = document.getElementById('player1').value;
        const player1Points = document.getElementById('player1Points').value;
        const player2 = document.getElementById('player2').value;
        const player2Points = document.getElementById('player2Points').value;

        if (player1 === '' || player2 === '') {
          console.error('Both players must be selected');
          return;
        }

        await addGame(player1, player2, player1Points, player2Points);
      }}>
        <label htmlFor="player1">Player 1:</label>
        <select id="player1">
          <option value="">Select Player 1</option>
          {players.map(player => <option key={player._id} value={player.name}>{player.name}</option>)}
        </select>
        <input type="number" id="player1Points" placeholder="Player 1 Points" />

        <label htmlFor="player2">Player 2:</label>
        <select id="player2">
          <option value="">Select Player 2</option>
          {players.map(player => <option key={player._id} value={player.name}>{player.name}</option>)}
        </select>
        <input type="number" id="player2Points" placeholder="Player 2 Points" />

        <button type="submit">Create Game</button>
      </form>
      <section id="gamesList">
        {games.map((game) => (
          <div key={game._id}>
            {game.player1} vs {game.player2}: {game.player1Points} - {game.player2Points}
            <button onClick={() => removeGame(game._id)}>Remove</button>
          </div>
        ))}
      </section>
    </>
  );
}