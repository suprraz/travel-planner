// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardHeader from 'material-ui/Card/CardHeader'
import CardMedia from 'material-ui/Card/CardMedia'
import CardActions from 'material-ui/Card/CardActions'
import CardTravelIcon from 'material-ui/svg-icons/action/card-travel';

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
          <AppBar title="Travel Planner" iconElementLeft={
            <CardTravelIcon className="material-icon" style={{marginTop: 10, color: 'white'}}/>
          }/>
          <Card>
            <CardHeader titleStyle={{fontSize: '1.3em'}} title={'Hello, Bonjour, Ciao, Hola, Namaste, Salaam!'} subtitle={'Login or sign up for an account to get started'} />
            <CardMedia>
              <img className="logo" src={require('./images/travel_items.jpg')} alt="travel items"/>
            </CardMedia>
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