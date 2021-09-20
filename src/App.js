import "./App.css";
import React from "react";

import web3 from './web3';
import lotteryContract from './lottery';

class App extends React.Component {

  state = { // Don't forget to initialize state
    manager: '',
    participantCount: 0,
    prize: ''
  };

  async componentDidMount() {
    const contractManager = await lotteryContract.methods.manager().call(); // Get current address of manager then add to state
    const players = await lotteryContract.methods.getParticipants().call();
    const prize = await web3.eth.getBalance(lotteryContract.options.address);

    this.setState({ manager: contractManager, participantCount: players.length, prize: prize });
  };

  render() {

    web3.eth.getAccounts()
      .then(console.log(`Web3 version: ${web3.version}`));

      // Test console logs
      console.log(this.state.manager);

    return (
      <div>
        <h2>Eth-Lottery</h2>
        <p>Lottery manager: <strong>{this.state.manager}</strong></p>
        <p>
          There are currently: <strong>{this.state.participantCount}</strong> 
          participant(s) entered to win <strong>{web3.utils.fromWei(this.state.prize, 'ether')}</strong> ether.
        </p>
      </div>
    );
  }
}

export default App;

