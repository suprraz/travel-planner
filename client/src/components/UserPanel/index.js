// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import ApiUtils from '../../ApiUtils'


const serverHost = 'http://'+ window.location.hostname +':10010';

export default class UserPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: ''
    };
  }

  componentDidMount() {
    this.getUsers()
  }

  getUsers() {
      fetch(serverHost + '/users', {
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
              this.setState( {users: responseJson});
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

  addUser() {
    const name = this.refs.name.value;
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const role = this.refs.role.value;

    if(!name) {
      this.setState( {alert: 'Please enter a name'});
      return;
    }

    if(!username) {
      this.setState( {alert: 'Please enter a start date'});
      return;
    }
    if(!password) {
      this.setState( {alert: 'Please enter an end date'});
      return;
    }

    if(!role) {
      this.setState( {alert: 'Please enter a role'});
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
        name,
        username,
        password,
        role
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errmsg) {
        this.setState( {alert: responseJson.errmsg});
      } else {
        this.getUsers()
      }
    })
    .catch((error) => {
      if(error.message === 'Unauthorized') {
        this.props.router.push('/');
      }
    });
  }

  saveUser(user) {
    const name = user.name;
    const username = user.username;
    const password = user.password;
    const role = user.role;

    if(!name) {
      this.setState( {alert: 'Please enter a name'});
      return;
    }

    if(!username) {
      this.setState( {alert: 'Please enter a start date'});
      return;
    }
    if(!password) {
      this.setState( {alert: 'Please enter an end date'});
      return;
    }

    if(!role) {
      this.setState( {alert: 'Please enter a role'});
      return;
    }

    fetch(serverHost + '/users/' + user.username, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        username,
        password,
        role
      })
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.errmsg) {
          this.setState( {alert: responseJson.errmsg});
        } else {
          this.getUsers()
        }
      })
      .catch((error) => {
        if(error.message === 'Unauthorized') {
          this.props.router.push('/');
        } else {
          this.setState( {alert: error.message});
        }
      });
  }

  deleteUser(user) {
    fetch(serverHost + '/users/' + user.username, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then(() => {
        this.getUsers()
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

  dashboard() {
    this.props.router.push('/dashboard');
  }

  clearInputs() {
    this.refs.name.value = '';
    this.refs.username.value = '';
    this.refs.password.value = '';
    this.refs.role.value = '';
  }

  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {


    let users = <h5>No users to show.</h5>;

    if(this.state.users && this.state.users.length) {
      let rows = []
      for(var i = 0; i < this.state.users.length; i++) {
        const user = this.state.users[i];
        rows.push(<tr key={user.username}>
          <td>
            <input type="text" size="20" placeholder="Name" onChange={(event) => {this.clearAlert(); user.name = event.target.value;}} value={user.name}></input>
          </td>
          <td>
            <input type="text" size="20" placeholder="username" onChange={(event) => {this.clearAlert(); user.username = event.target.value;}} value={user.username}></input>
          </td>
          <td>
            <input type="text" size="20" placeholder="password" onChange={(event) => {this.clearAlert(); user.password = event.target.value;}} value={user.password}></input>
          </td>
          <td>
            <input type="text" size="20" placeholder="role" onChange={(event) => {this.clearAlert(); user.role = event.target.value;}} value={user.role}></input>
          </td>
          <td><a href="#" onClick={() => this.saveUser(user)}>save</a></td>
          <td><a href="#" onClick={() => this.deleteUser(user)}>delete</a></td>
        </tr>)
      }
      users = <table>
        <tbody>
          {rows}
        </tbody>
      </table>

    }

    const addUser = <div>

      <h3>Add a user:</h3>
      <h3>
        <input type="text" ref="name" size="20" placeholder="Name" onChange={() => {this.clearAlert()}}></input>
      </h3>
      <h3>
        <input type="text" ref="username" size="20" placeholder="Start Date" onChange={() => {this.clearAlert()}} value={(new Date).toISOString()}></input>
      </h3>
      <h3>
        <input type="text" ref="password" size="20" placeholder="End Date" onChange={() => {this.clearAlert()}} value={(new Date).toISOString()}></input>
      </h3>
      <h3>
        <input type="text" ref="role" size="20" placeholder="Role" onChange={() => {this.clearAlert()}}></input>
      </h3>

      <button onClick={() => this.addUser()}>Add User</button>
    </div>

    return (
      <div className="page">
        <div className="container">
          <div className="logout" >
            <a href="#" onClick={() => this.dashboard()}>Dashboard</a>
            &nbsp;|&nbsp;
            <a href="#" onClick={() => this.logout()}>Log out</a>
          </div>

          <h1 className="page_title">User Panel</h1>
          <img className="logo_small" src={require('./images/suitcase.png')} alt="suitcase"/>
          <h3 className='alert'>{this.state.alert}</h3>

          {users}
          {addUser}
        </div>
      </div>
    );
  }
}