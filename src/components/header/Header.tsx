import { Component } from 'react';
import { FaUser } from 'react-icons/fa';

import reactLogo from '@rs-react/assets/react.svg';
import { Button } from '@rs-react/components/ui';

import './header.css';

export class Header extends Component {
  state = { throwError: false };

  setError = (): void => {
    this.setState({ throwError: true });
  };

  render() {
    if (this.state.throwError) {
      throw new Error('Error triggered in class component render');
    }

    return (
      <header className="header">
        <div className="header-block">
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <h1>RS React</h1>
        </div>
        <Button onClick={this.setError} text="Error Boundary" type="danger" />
        <div className="header-block">
          <FaUser />
          <p className="user-name">Darya</p>
        </div>
      </header>
    );
  }
}
