import React, { Component } from 'react';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
          >
            BC Wallet
          </a>
        </nav>
        <h1 className="text-center mt-5">Blockchain Wallet</h1>
      </div>
    );
  }
}

export default App;
