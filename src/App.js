import "./App.css";
import React from "react";

import web3 from './web3';
import lotteryContract from './lottery';

class App extends React.Component {
  // Initialize state variables
  state = {
    manager: '',
    participantCount: 0,
    prize: '',
    value: '',
    message: '',
    lastWinner: ''
  };

  // Call on page creation
  async componentDidMount() {
    const contractManager = await lotteryContract.methods.manager().call(); // Get current address of manager then add to state
    const players = await lotteryContract.methods.getParticipants().call();
    const prize = await web3.eth.getBalance(lotteryContract.options.address);

    this.setState({ manager: contractManager, participantCount: players.length, prize: prize });
  };

  // Enter Lottery
  onSubmit = async (e) => { // Arrow functions remove need for 'this' keyword
    e.preventDefault();

    const accounts = await web3.eth.getAccounts(); // Get list of accounts 

    this.setState({ message: "Waiting on transaction completion..." }); // Show message on waiting for transaction to finish

    await lotteryContract.methods.enterLottery().send( // Send transaction to enterLottery method in contract
      { from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')} // Assume current user is the first account in the accounts array, Convert to wei before sending transaction
    );

    this.setState({ message: "Lottery entry successful!"}) // Show message on transaction completion
  };

  // Pick a winner
  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Picking winner..." });
    await lotteryContract.methods.getWinner().send({ from: accounts[0] }); // Send eth to winner (random-ish account who entered)
    
    this.setState({ lastWinner: await lotteryContract.methods.lastWinner().call() }); // Get last winner of lottery to display on page
    this.setState({ message: `The winner is: ${this.state.lastWinner}` });
  };

  render() {
    // Test console logs
    web3.eth.getAccounts()
      .then(console.log(`Web3 version: ${web3.version}`));  
    console.log(this.state.manager);
    console.log(this.state.prize);

    return (
      <div class="app-container">
        <h1>Ethereum Lottery</h1>
        <p>Lottery manager: <strong>{this.state.manager}</strong></p>
        <p>
          There are currently: <strong>{this.state.participantCount}</strong> participant(s) entered to win <strong>{web3.utils.fromWei(this.state.prize, 'ether')}</strong> ether.
        </p> 

        <form onSubmit={this.onSubmit}>
          <h2>Want to enter?</h2>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              className="ether-input"
              placeholder=">.01 ether"
              value={this.state.value} 
              onChange={(event) => this.setState({ value: event.target.value })} 
            />
            <button className="enter-btn">Enter Lottery</button>
          </div>
        </form>

        <h2>Pick Lottery Winner</h2>
        <button className="pck-winner-btn" onClick={this.onClick}>Pick winner</button>

        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;

