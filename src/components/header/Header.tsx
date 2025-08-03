import { FaUser } from 'react-icons/fa';

import { Navigation, Toggle } from '@rs-react/components';
import { useTheme } from '@rs-react/context';

import './header.css';

export function Header() {
  const { theme, setTheme } = useTheme();

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
        <Toggle
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>
    </header>
  );
}
