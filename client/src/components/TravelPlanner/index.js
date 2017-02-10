// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

export default class TravelPlanner extends Component {
  login() {
    this.props.router.push('/login');
  }

  signUp() {
    this.props.router.push('/signup');
  }

  render() {
    const contents = <div>
        <br />
        <div className='left'>
          <button onClick={() => {this.signUp()}}>Sign Up</button>
        </div>
        <div className='right'>
          <button onClick={() => {this.login()}}>Login</button>
        </div>
      </div>

    return (
      <div className="page">
        <div className="container">
          <h1>Travel Planner</h1>
          <img className="logo" src={require('./images/suitcase.png')} alt="hangman"/>

          {contents}
        </div>
      </div>
    );
  }
}