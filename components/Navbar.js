import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
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
  );
}