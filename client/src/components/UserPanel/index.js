// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import ApiUtils from '../../ApiUtils'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardText from 'material-ui/Card/CardText'
import CardHeader from 'material-ui/Card/CardHeader'
import TextField from 'material-ui/TextField'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import Dialog from 'material-ui/Dialog'
import SelectField from 'material-ui/SelectField'
import Table from 'material-ui/Table'
import TableBody from 'material-ui/Table/TableBody'
import TableHeader from 'material-ui/Table/TableHeader'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableRowColumn from 'material-ui/Table/TableRowColumn'

import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import CardTravelIcon from 'material-ui/svg-icons/action/card-travel';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import SaveIcon from 'material-ui/svg-icons/content/save';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ViewAgendaIcon from 'material-ui/svg-icons/action/view-agenda';


const serverHost = 'http://'+ window.location.hostname +':10010';

export default class UserPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUserDialogOpen: false,
      alert: '',
      editAlert: '',
      isManager: false,
      users: []
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
          var isManager = false;
          if(responseJson.length === 1 && (responseJson[0].role === 'admin' || responseJson[0].role === 'manager')) {
            isManager = true;
          } else if( responseJson.length > 1) {
            isManager = true;
          }
          this.setState( {users: responseJson, isManager: isManager});
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
    const name = this.refs.name.getValue();
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();

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
        password
      })
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.errmsg) {
          this.setState( {alert: responseJson.errmsg});
        } else {
          this.setState({addUserDialogOpen:false});
          this.getUsers()
        }
      })
      .catch((error) => {
        if(error.message === 'Unauthorized') {
          this.props.router.push('/');
        } else if(error.message === 'Conflict') {
          this.setState( {alert: 'Username is taken.  Please try another'});
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

    if(!password) {
      this.setState( {alert: 'Please enter a password'});
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
          this.setState( {editAlert: responseJson.errmsg});
        } else {
          this.getUsers()
        }
      })
      .catch((error) => {
        if(error.message === 'Unauthorized') {
          this.props.router.push('/');
        } else {
          this.setState( {editAlert: error.message});
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
    this.setState( {alert: '', editAlert: ''});
  }

  render() {

    let users = <Card><CardHeader title={this.state.isManager ? 'Users' : 'My Settings'}></CardHeader><CardText>No users planned</CardText></Card>;
    if(this.state.users && this.state.users.length) {
      let rows = [];
      for(var i = 0; i < this.state.users.length; i++) {
        const user = this.state.users[i];
        rows.push(<TableRow key={user._id} selectable={false}>
          <TableRowColumn>
            <TextField name={user._id + 'name'} placeholder="Name" onChange={(err, value) => {this.clearAlert(); console.log(value); user.name =  value;}} value={user.name}></TextField>
          </TableRowColumn>
          <TableRowColumn>
            <TextField name={user._id + 'username'} disabled={true} placeholder="username" onChange={(err, value) => {this.clearAlert(); user.username = value;}} value={user.username}></TextField>
          </TableRowColumn>
          <TableRowColumn>
            <TextField name={user._id + 'password'} placeholder="password" onChange={(err, value) => {this.clearAlert(); user.password = value;}} value={user.password}></TextField>
          </TableRowColumn>
          <TableRowColumn>
            <SelectField name={user._id + 'role'} disabled={!this.state.isManager} onChange={(err, index, value) => {this.clearAlert(); user.role = value;}} value={user.role}>
              <MenuItem value={'admin'} primaryText={'Administrator'}/>
              <MenuItem value={'manager'} primaryText={'Manager'}/>
              <MenuItem value={'user'} primaryText={'User'}/>
            </SelectField>
          </TableRowColumn>
          <TableRowColumn>
            <FlatButton onClick={() => this.saveUser(user)}>Save <SaveIcon className="material-icon" style={{color: '#00bcd4'}}/> </FlatButton>
            <FlatButton onClick={() => this.deleteUser(user)}>Delete <DeleteIcon className="material-icon" style={{color: '#ff4081'}} /> </FlatButton>
          </TableRowColumn>
        </TableRow>)
      }
      users = <Card>
        <CardHeader title={this.state.isManager ? 'Users' : 'Profile Settings'}></CardHeader>
        <div className='alert'>{this.state.editAlert}</div>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Password</TableHeaderColumn>
              <TableHeaderColumn>Role</TableHeaderColumn>
              <TableHeaderColumn>User Operations</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {rows}
          </TableBody>
        </Table>
      </Card>

    }

    let addUserButton = null;
    if(this.state.isManager) {
      addUserButton = <RaisedButton onClick={()=>{this.setState({addUserDialogOpen:true})}}>Add User</RaisedButton>
    }


    return (
      <div className="page">
        <div className="container">
          <AppBar title="Travel Planner: User Panel"
                  iconElementLeft={
                    <CardTravelIcon className="material-icon" style={{marginTop: 10, color: 'white'}}/>
                  }
                  iconElementRight={
                    <IconMenu
                      iconButtonElement={
                        <IconButton><MoreHorizIcon /></IconButton>
                      }
                    >
                      <MenuItem
                        onClick={() => this.dashboard()}>Trip Dashboard <ViewAgendaIcon className="material-icon" /></MenuItem>
                      <MenuItem
                        onClick={() => this.logout()}>Log out <ExitToAppIcon className="material-icon" /></MenuItem>

                    </IconMenu>
                  }
          />

          <br />
          {addUserButton}
          <br />
          <br />

          <Dialog title={'Add User'} open={this.state.addUserDialogOpen}
                  actions={[
                    <RaisedButton style={{margin: 12}} onClick={() => this.setState({addUserDialogOpen:false})}>Cancel</RaisedButton>,
                    <RaisedButton style={{margin: 12}} primary={true} onClick={() => this.addUser()}
                    >Add User</RaisedButton>]}>
            <div className='alert'>{this.state.alert}</div>

            <TextField ref="name" name="name" placeholder="Name" onChange={() => {this.clearAlert();}}></TextField>
            <br />
            <TextField ref="username" name="username" placeholder="username" onChange={() => {this.clearAlert();}}></TextField>
            <br />
            <TextField type="password" ref="password" name="password" placeholder="password" onChange={() => {this.clearAlert();}}></TextField>
            <br />

          </Dialog>

          {users}

        </div>
      </div>
    );
  }
}