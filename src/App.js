import "./App.css";
import React from "react";

import web3 from './web3.js';

class App extends React.Component {
  render() {

    web3.eth.getAccounts()
      .then(console.log(`Web3 version: ${web3.version}`));

    return (
      <div className="App">
        <h1>Eth-Lottery</h1>

      </div>
    );
  }
}

export default App;

