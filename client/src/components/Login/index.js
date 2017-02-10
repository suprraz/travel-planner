// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import ApiUtils from '../../ApiUtils'

import './style.css';

const serverHost = 'http://'+ window.location.hostname +':10010';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: ''
    };
  }

  componentDidMount() {
  }

  login() {
    const username = this.refs.username.value;
    const password = this.refs.password.value;

    if(!username) {
      this.setState( {alert: 'Please type a username to login.'});
      return;
    }

    if(!password) {
      this.setState( {alert: 'Please type a password to login.'});
      return;
    }

    fetch(serverHost + '/login', {
      method: 'POST',
      credentials: 'include',
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
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errmsg) {
        this.setState( {alert: responseJson.errmsg});
      } else {
        this.props.router.push('/dashboard');
      }
    })
    .catch((error) => {
      if(error.message === 'Unauthorized') {
        this.setState( {alert: 'Incorrect username or password.'});
      }
    });
  }

  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    const contents = <div>
        <div className='alert'>{this.state.alert}</div>
          <h3>
            <input ref="username" size="20" placeholder="username" onChange={() => {this.clearAlert()}}></input>
          </h3>

          <h3>
            <input type="password" ref="password" size="20" placeholder="password" onChange={() => {this.clearAlert()}}></input>
          </h3>

        <button onClick={() => this.login()}>Log In</button>
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