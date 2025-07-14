import { FaUser } from 'react-icons/fa';

import reactLogo from '../../assets/react.svg';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-block">
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>RS React</h1>
      </div>
      <div className="header-block">
        <FaUser />
        <p className="user-name">Darya</p>
      </div>
    </header>
  );
}

export default Header;
