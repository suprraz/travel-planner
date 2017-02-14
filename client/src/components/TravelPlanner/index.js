// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardActions from 'material-ui/Card/CardActions'

export default class TravelPlanner extends Component {
  login() {
    this.props.router.push('/login');
  }

  signUp() {
    this.props.router.push('/signup');
  }

  render() {
    return (
      <div className="page">
        <div className="container">
          <AppBar title="Travel Planner"></AppBar>
          <Card>
            <img className="logo" src={require('./images/suitcase.png')} alt="hangman"/>
            <CardActions>
              <RaisedButton primary={true} style={{margin: 12}} onClick={() => {this.signUp()}}>Sign Up</RaisedButton>
              <RaisedButton style={{margin: 12}} onClick={() => {this.login()}}>Login</RaisedButton>
            </CardActions>
          </Card>


        </div>
      </div>
    );
  }
}