// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import ApiUtils from '../../ApiUtils'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardHeader from 'material-ui/Card/CardHeader'
import CardText from 'material-ui/Card/CardText'
import CardActions from 'material-ui/Card/CardActions'
import TextField from 'material-ui/TextField'
import CardTravelIcon from 'material-ui/svg-icons/action/card-travel';

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
    const name = this.refs.name.getValue();
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();

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
      this.props.router.push('/dashboard');
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        this.setState( {alert: 'username ' + username + ' is already taken'});
      } else {
        this.setState( {alert: 'There was an error with your request.'});
      }
    });
  }

  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    return (
      <div className="page">
        <div className="container">
          <AppBar title="Travel Planner" iconElementLeft={
            <CardTravelIcon className="material-icon" style={{marginTop: 10, color: 'white'}}/>
          }>
          </AppBar>
          <Card>
            <CardHeader title={'Please enter the following information to join'} />
            <CardText>
              <TextField style={{margin:10}} name="name" ref="name" size="20" placeholder="Name" onChange={() => {this.clearAlert()}}></TextField>
              <br />
              <TextField style={{margin:10}} name="username" ref="username" size="20" placeholder="username" onChange={() => {this.clearAlert()}}></TextField>
              <br />
              <TextField style={{margin:10}} name="password" type="password" ref="password" size="20" placeholder="password" onChange={() => {this.clearAlert()}}></TextField>
              <div className='alert'>{this.state.alert}</div>
            </CardText>
            <CardActions>
              <RaisedButton style={{margin: 10}} onClick={() => {this.signUp()}}>Join</RaisedButton>
            </CardActions>
          </Card>

        </div>
      </div>
    );
  }
}