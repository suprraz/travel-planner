// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import './style.css';

const hangmanServer = 'http://'+ window.location.hostname +':10010';

const imageList = [
  require('./images/Hangman-0.svg'),
  require('./images/Hangman-1.svg'),
  require('./images/Hangman-2.svg'),
  require('./images/Hangman-3.svg'),
  require('./images/Hangman-4.svg'),
  require('./images/Hangman-5.svg'),
  require('./images/Hangman-6.svg')
];

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.imageList = imageList;

    this.state = {
      alert: ''
    };
  }

  componentDidMount() {
  }

  newGame() {
    return fetch(hangmanServer + '/game', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // firstParam: 'yourValue',
        // secondParam: 'yourOtherValue',
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({game: responseJson.game});
        return this.state;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  guessLetter(letter) {
    if(!letter) {
      this.setState( {alert: 'Please type a letter to guess.'});
      return;
    }
    fetch(hangmanServer + '/game/' + this.state.game.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        letter: letter
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({game: responseJson.game});
      this.clearInputs();
      return this.state;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  clearInputs() {
    this.refs.letter.value = '';
    this.refs.word.value = '';
  }

  guessWord(word) {
    if(!word) {
      this.setState( {alert: 'Please type a word to guess.'});
      return;
    }
    fetch(hangmanServer + '/game/' + this.state.game.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: word
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({game: responseJson.game});
        this.clearInputs();
        return this.state;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    let contents = [];
    if(!this.state.game) {
      contents = <div>
        <button onClick={() => {this.newGame()}}>New Game</button>
      </div>
    }
    else if(this.state.game.mistakes >= 6) {
      const hangmanDead = require('./images/hangman-dead.jpg');

      contents = <div>
        <img src={hangmanDead} alt="hangman"/>
        <h3>You Lose</h3>
        <button onClick={() => {this.newGame()}}>New Game</button>
      </div>
    } else if (this.state.game.progress.indexOf('_') === -1) {
      const hangmanDance = require('./images/hangman-dance.gif');

      contents =  <div>

        <img src={hangmanDance} alt="hangman"/>
        <h3>You Win!</h3>
        <button onClick={() => {this.newGame()}}>New Game</button>
      </div>
    } else {
      contents = <div>
        <img src={this.imageList[this.state.game.mistakes]} alt="hangman"/>
        <h1>{this.state.game.progress}</h1>

        <div className='alert'>{this.state.alert}</div>
        <div className='left'>
          <h1>
            <input ref="letter" size="1" onChange={() => {this.clearAlert()}}></input>
          </h1>
          <button onClick={() => this.guessLetter(this.refs.letter.value)}>Guess Letter</button>

        </div>
        <div className='right'>
          <h1>
            <input ref="word" size={this.state.game.progress.length} onChange={() => {this.clearAlert()}}></input>
          </h1>
          <button onClick={() => this.guessWord(this.refs.word.value)} >Guess Word</button>
        </div>
      </div>
    }

    return (
      <div className="page">
        <div className="container">

          <img className="logo" src={require('./images/hangman-logo.png')} alt="hangman"/>

          {contents}
        </div>
      </div>
    );
  }
}