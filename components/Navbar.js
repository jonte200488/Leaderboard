// /components/Navbar.js

import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navbar() {
  return (
    <nav className={navbar}>
      <Link href="/">Leaderboard</Link>
      <Link href="/manage-games">Manage Games</Link>
      <Link href="/manage-players">Manage Players</Link>
    </nav>
  );
}