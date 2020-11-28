import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import daiLogo from './dai-logo.png';
import FakeDaiToken from './abis/FakeDaiToken.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      fakeDaiToken: null,
      balance: 0,
      transactions: []
    }

    this.transfer = this.transfer.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const daiTokenAddress = "0xD58980c457e82eD9ab6AcEfA59C02fD1079BC7Fb" // Replace DAI Address Here
    const fakeDaiToken = new web3.eth.Contract(FakeDaiToken.abi, daiTokenAddress);
    this.setState({ fakeDaiToken: fakeDaiToken });

    const balance = await fakeDaiToken.methods.balanceOf(this.state.account).call();
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') });

    // Get the history of transactions from blockchain
    const transactions = await fakeDaiToken.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } });
    this.setState({ transactions: transactions });
    console.log(transactions);
  }

  transfer(recipient, amount) {
    // Must call send() and pass the sender's address
    // User need to sign this transaction on MetaMask in order to finalize it on the blockchain
    this.state.fakeDaiToken.methods.transfer(recipient, amount).send({ from: this.state.account });
  }

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
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <img className="my-2" src={daiLogo} width="150" alt="Dai" />
                <h1>{this.state.balance} DAI</h1>

                <form onSubmit={(event) => {
                  event.preventDefault();

                  const recipient = this.recipient.value;
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether');
                  this.transfer(recipient, amount);
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
