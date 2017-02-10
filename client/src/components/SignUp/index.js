// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import ApiUtils from '../../ApiUtils'

const serverHost = 'http://'+ window.location.hostname +':10010';

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: ''
    };
  }

  componentDidMount() {
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
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.router.push('/dashboard');
    })
    .catch((error) => {
      if(error.response.status === 400) {
        this.setState( {alert: 'There was an error with your request.'});
      } else if (error.response.status === 409) {
        this.setState( {alert: 'username ' + username + ' is already taken'});
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