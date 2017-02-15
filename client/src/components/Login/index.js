// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'
import ApiUtils from '../../ApiUtils'
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardHeader from 'material-ui/Card/CardHeader'
import CardActions from 'material-ui/Card/CardActions'
import CardText from 'material-ui/Card/CardText'
import TextField from 'material-ui/TextField'
import CardTravelIcon from 'material-ui/svg-icons/action/card-travel';

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
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();

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



    return (
      <div className="page">
        <div className="container">
          <AppBar title="Travel Planner: Log In" iconElementLeft={
            <CardTravelIcon className="material-icon" style={{marginTop: 10, color: 'white'}}/>
          }>
          </AppBar>
          <Card>
            <CardHeader title={'Please enter your username and password to log in'} />
            <CardText>
            <TextField style={{margin:10}} ref="username" name="username" size="20" placeholder="username" onChange={() => {this.clearAlert()}}></TextField>
            <TextField style={{margin:10}} type="password" ref="password" name="password" size="20" placeholder="password" onChange={() => {this.clearAlert()}}></TextField>
            <div className='alert'>{this.state.alert}</div>
            </CardText>
            <CardActions>
              <RaisedButton style={{margin: 10}} onClick={() => {this.login()}}>Login</RaisedButton>
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}