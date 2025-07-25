import { Component } from 'react';
import { FaUser } from 'react-icons/fa';

import reactLogo from '@rs-react/assets/react.svg';

import './header.css';

export class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header-block">
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <h1 data-testid="header-title">RS React</h1>
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
}
