import { FaUser } from 'react-icons/fa';

import { Navigation } from '@rs-react/components';

import './header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-block">
        <h1 className="header-title" data-testid="header-title">
          RSS React course
        </h1>
      </div>
      <div className="header-block">
        <Navigation />
      </div>
      <div className="header-block">
        <FaUser />
        <p data-testid="header-user" className="user-name">
          Darya
        </p>
      </div>
    </header>
  );
}
