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
    this.getTrips()
  }

  getTrips() {
      fetch(serverHost + '/trips', {
        method: 'GET',
        credentials: 'include',
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
        }
      })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
          if(responseJson.errmsg) {
              this.setState( {alert: responseJson.errmsg});
          } else {
              this.setState( {trips: responseJson});
              this.clearInputs();
              this.forceUpdate();
          }
      })
      .catch((error) => {
        if(error.message === 'Unauthorized') {
          this.props.router.push('/');
        }
      });
  }

  addTrip() {
    const destination = this.refs.destination.value;
    const startDate = this.refs.startDate.value;
    const endDate = this.refs.endDate.value;
    const comment = this.refs.comment.value;

    if(!destination) {
      this.setState( {alert: 'Please enter a destination'});
      return;
    }

    if(!startDate) {
      this.setState( {alert: 'Please enter a start date'});
      return;
    }
    if(!endDate) {
      this.setState( {alert: 'Please enter an end date'});
      return;
    }

    if(!comment) {
      this.setState( {alert: 'Please enter a comment'});
      return;
    }

    fetch(serverHost + '/trips', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination,
        startDate,
        endDate,
        comment
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errmsg) {
        this.setState( {alert: responseJson.errmsg});
      } else {
        this.getTrips()
      }
    })
    .catch((error) => {
      if(error.message === 'Unauthorized') {
        this.props.router.push('/');
      }
    });
  }

  deleteTrip(trip) {
    debugger
    fetch(serverHost + '/trips', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.errmsg) {
          this.setState( {alert: responseJson.errmsg});
        } else {
          this.getTrips()
        }
      })
      .catch((error) => {
        if(error.message === 'Unauthorized') {
          this.props.router.push('/');
        }
      });
  }

  logout() {
    fetch(serverHost + '/logout', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.router.push('/');
      })
      .catch((error) => {
        this.props.router.push('/');
      });
  }

  clearInputs() {
    this.refs.destination.value = '';
    this.refs.startDate.value = '';
    this.refs.endDate.value = '';
    this.refs.comment.value = '';
  }

  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    let trips = <h5>No trips to show.</h5>;

    if(this.state.trips && this.state.trips.length) {
      let rows = []
      for(var i = 0; i < this.state.trips.length; i++) {
        const trip = this.state.trips[i];
        rows.push(<tr key={trip._id}>
          <td>{trip.destination}</td>
          <td>{trip.startDate}</td>
          <td>{trip.endDate}</td>
          <td>{trip.comment}</td>
          <td><a href="#" onClick={() => this.saveTrip(trip)}>save</a></td>
          <td><a href="#" onClick={() => this.deleteTrip(trip)}>delete</a></td>
        </tr>)
      }
      trips = <table>
        <tbody>
          {rows}
        </tbody>
      </table>

    }

    const addTrip = <div>

      <h3>Add a trip:</h3>
      <div className='alert'>{this.state.alert}</div>
      <h3>
        <input type="text" ref="destination" size="20" placeholder="Destination" onChange={() => {this.clearAlert()}}></input>
      </h3>

      <h3>
        <input type="text" ref="startDate" size="20" placeholder="Start Date" onChange={() => {this.clearAlert()}} value={(new Date).toISOString()}></input>
      </h3>
      <h3>
        <input type="text" ref="endDate" size="20" placeholder="End Date" onChange={() => {this.clearAlert()}} value={(new Date).toISOString()}></input>
      </h3>
      <h3>
        <textarea type="text" ref="comment" size="20" placeholder="Comment" onChange={() => {this.clearAlert()}}></textarea>
      </h3>

      <button onClick={() => this.addTrip()}>Add Trip</button>
    </div>

    return (
      <div className="page">
        <div className="container">
          <div className="logout" >
            <a href="#" onClick={() => this.logout()}>Log out</a>
          </div>

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