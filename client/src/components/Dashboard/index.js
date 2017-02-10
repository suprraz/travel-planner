// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

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

  addTrip() {
    const destination = this.refs.destination.value;
    const start_date = this.refs.start_date.value;
    const end_date = this.refs.end_date.value;
    const comment = this.refs.comment.value;


    if(!destination) {
      this.setState( {alert: 'Please enter a destination'});
      return;
    }

    if(!start_date) {
      this.setState( {alert: 'Please enter a start date'});
      return;
    }
    if(!end_date) {
      this.setState( {alert: 'Please enter an end date'});
      return;
    }

    if(!comment) {
      this.setState( {alert: 'Please enter a comment'});
      return;
    }

    fetch(serverHost + '/trips', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination,
        start_date,
        end_date,
        comment
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errmsg) {
        this.setState( {alert: responseJson.errmsg});
      } else {
        this.setState( {trips: responseJson.trips});
        this.clearInputs();
        this.forceUpdate();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  clearInputs() {
    this.refs.destination.value = '';
    this.refs.start_date.value = '';
    this.refs.end_date.value = '';
    this.refs.comment.value = '';
  }

  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    const trips = <div>
      <h5>No trips to show.</h5>
    </div>

    const addTrip = <div>

      <h3>Add a trip:</h3>
      <div className='alert'>{this.state.alert}</div>
      <h3>
        <input type="text" ref="destination" size="20" placeholder="Destination" onChange={() => {this.clearAlert()}}></input>
      </h3>

      <h3>
        <input type="text" ref="start_date" size="20" placeholder="Start Date" onChange={() => {this.clearAlert()}}></input>
      </h3>
      <h3>
        <input type="text" ref="end_date" size="20" placeholder="End Date" onChange={() => {this.clearAlert()}}></input>
      </h3>
      <h3>
        <textarea type="text" ref="comment" size="20" placeholder="Comment" onChange={() => {this.clearAlert()}}></textarea>
      </h3>

      <button onClick={() => this.addTrip()}>Add Trip</button>
    </div>


    return (
      <div className="page">
        <div className="container">
          <h1>Travel Planner</h1>
          <h3 className="page_title">Trip Dashboard</h3>
          <img className="logo_small" src={require('./images/suitcase.png')} alt="suitcase"/>
          {trips}
          {addTrip}
        </div>
      </div>
    );
  }
}