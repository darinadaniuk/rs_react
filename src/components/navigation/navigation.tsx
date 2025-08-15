'use client';

import Link from 'next/link';
import './navigation.css';

export function Navigation() {
  return (
    <nav className="navigation">
      <Link className="navigation-link" href="/cards">
        Home
      </Link>
      <Link className="navigation-link" href="/about">
        About
      </Link>
    </nav>
  );
}
