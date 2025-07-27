import { Link } from 'react-router-dom';

import './navigation.css';

export function Navigation() {
  return (
    <nav className="navigation">
      <Link className="navigation-link" to="/">
        Home
      </Link>
      <Link className="navigation-link" to="/about">
        About
      </Link>
    </nav>
  );
}
