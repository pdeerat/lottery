import "./App.css";
import React from "react";

import web3 from './web3';
import contract from './lottery';

class App extends React.Component {
  render() {

    web3.eth.getAccounts()
      .then(console.log(`Web3 version: ${web3.version}`));

      // Test console logs
      console.log(contract.options.address);

    return (
      <div className="App">
        <h1>Eth-Lottery</h1>
        <p>Lottery deployed at: <strong>{contract.options.address}</strong></p>
      </div>
    );
  }
}

export default App;

