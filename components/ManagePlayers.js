// /components/ManagePlayers.js

import styles from '../styles/Home.module.css';

export default function ManagePlayers({ players, addPlayer, removePlayer }) {
  return (
    <>
      <h2>Manage Players</h2>
      <form id="newPlayerForm" className={styles.newPlayerForm} onSubmit={async (e) => {
        e.preventDefault();
        const playerName = document.getElementById('playerName').value;
        const playerImage = document.getElementById('playerImage').value || "default-image-url.jpg";
        await addPlayer(playerName, playerImage);
      }}>
        <input type="text" id="playerName" placeholder="Player Name" />
        <input type="text" id="playerImage" placeholder="Profile Image URL" />
        <button type="submit">Add Player</button>
      </form>
      <section id="playersList">
        {players.map((player) => (
          <div key={player._id} className={styles.playerEntry}>
            <img src={player.image} alt={player.name} className={styles.playerImage} />
            {player.name}
            <button onClick={() => removePlayer(player._id)}>Remove</button>
          </div>
        ))}
      </section>
    </>
  );
}