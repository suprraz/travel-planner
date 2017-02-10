// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import './style.css';

const serverHost = 'http://'+ window.location.hostname +':10010';

const imageList = [
  require('./images/Hangman-0.svg'),
  require('./images/Hangman-1.svg'),
  require('./images/Hangman-2.svg'),
  require('./images/Hangman-3.svg'),
  require('./images/Hangman-4.svg'),
  require('./images/Hangman-5.svg'),
  require('./images/Hangman-6.svg')
];

export default class SignUp extends Component {
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
    return fetch(serverHost + '/game', {
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

  signUp() {
    const name = this.refs.name.value;
    const username = this.refs.username.value;
    const password = this.refs.password.value;

    if(!username) {
      this.setState( {alert: 'Please type a username to join.'});
      return;
    }

    if(!password) {
      this.setState( {alert: 'Please type a password to join.'});
      return;
    }

    fetch(serverHost + '/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errmsg) {
        this.setState( {alert: responseJson.errmsg});
      }
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
    fetch(serverHost + '/game/' + this.state.game.id, {
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
    const contents = <div>
        <div className='alert'>{this.state.alert}</div>
          <h3>
            <input ref="name" size="20" placeholder="Name" onChange={() => {this.clearAlert()}}></input>
          </h3>

          <h3>
            <input ref="username" size="20" placeholder="username" onChange={() => {this.clearAlert()}}></input>
          </h3>

          <h3>
            <input type="password" ref="password" size="20" placeholder="password" onChange={() => {this.clearAlert()}}></input>
          </h3>

        <button onClick={() => this.signUp()}>Join</button>
      </div>


    return (
      <div className="page">
        <div className="container">
          <h1>Travel Planner</h1>
          <h3 className="page_title">Join the world's best travel planner!</h3>
          <img className="logo_small" src={require('./images/suitcase.png')} alt="hangman"/>

          {contents}
        </div>
      </div>
    );
  }
}