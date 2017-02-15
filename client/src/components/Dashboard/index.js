// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import ApiUtils from '../../ApiUtils'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card'
import CardText from 'material-ui/Card/CardText'
import CardActions from 'material-ui/Card/CardActions'
import CardHeader from 'material-ui/Card/CardHeader'
import TextField from 'material-ui/TextField'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'
import Table from 'material-ui/Table'
import TableBody from 'material-ui/Table/TableBody'
import TableHeader from 'material-ui/Table/TableHeader'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import TableRow from 'material-ui/Table/TableRow'
import TableRowColumn from 'material-ui/Table/TableRowColumn'

import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';
import CardTravelIcon from 'material-ui/svg-icons/action/card-travel';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import SaveIcon from 'material-ui/svg-icons/content/save';
import DeleteIcon from 'material-ui/svg-icons/action/delete';


const serverHost = 'http://'+ window.location.hostname +':10010';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addTripDialogOpen: false,
      alert: '',
      editAlert: '',
      trips: []
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
    const destination = this.refs.destination.getValue();
    const startDate = this.refs.startDate.getDate().toISOString();
    const endDate = this.refs.endDate.getDate().toISOString();
    const comment = this.refs.comment.getValue();

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

    if(this.refs.endDate.getDate() < this.refs.startDate.getDate()) {
      this.setState( {alert: 'Trip must end after it starts'});
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
        this.setState({addTripDialogOpen:false});
        this.getTrips()
      }
    })
    .catch((error) => {
      if(error.message === 'Unauthorized') {
        this.props.router.push('/');
      }
    });
  }

  saveTrip(trip) {
    const destination = trip.destination;
    const startDate = trip.startDate;
    const endDate = trip.endDate;
    const comment = trip.comment;

    if(endDate < startDate) {
      this.setState( {editAlert: 'Trip must end after it starts'});
      return;
    }

    if(!destination) {
      this.setState( {editAlert: 'Please enter a destination'});
      return;
    }

    if(!startDate) {
      this.setState( {editAlert: 'Please enter a start date'});
      return;
    }
    if(!endDate) {
      this.setState( {editAlert: 'Please enter an end date'});
      return;
    }

    if(!comment) {
      this.setState( {editAlert: 'Please enter a comment'});
      return;
    }

    fetch(serverHost + '/trips/' + trip._id, {
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
          this.setState( {editAlert: responseJson.errmsg});
        } else {
          this.getTrips()
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

  deleteTrip(trip) {
    fetch(serverHost + '/trips/' + trip._id, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then(() => {
        this.getTrips()
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

  userpanel() {
    this.props.router.push('/userpanel');
  }

  clearInputs() {
    this.refs.destination.value = '';
    this.refs.startDate.value = '';
    this.refs.endDate.value = '';
    this.refs.comment.value = '';
  }

  clearAlert() {
    this.setState( {alert: '', editAlert: ''});
  }

  render() {

    let trips = <Card><CardHeader title={'Trips'}></CardHeader><CardText>No trips planned</CardText></Card>;

    if(this.state.trips && this.state.trips.length) {
      let rows = []
      for(var i = 0; i < this.state.trips.length; i++) {
        const trip = this.state.trips[i];
        rows.push(<TableRow key={trip._id} selectable={false}>
          <TableRowColumn>
            <TextField name={trip._id + 'destination'} placeholder="Destination" onChange={(err, value) => {this.clearAlert(); console.log(value); trip.destination =  value;}} value={trip.destination}></TextField>
          </TableRowColumn>
          <TableRowColumn>
            <DatePicker name={trip._id + 'startdate'} style={{margin:10}} autoOk={true} onChange={(err, newDate) => {this.clearAlert(); trip.startDate = newDate.toISOString();}} value={new Date(trip.startDate)}></DatePicker>
          </TableRowColumn>
          <TableRowColumn>
            <DatePicker name={trip._id + 'enddate'} style={{margin:10}} autoOk={true} onChange={(err, newDate) => {this.clearAlert(); trip.endDate = newDate.toISOString();}} value={new Date(trip.endDate)}></DatePicker>
          </TableRowColumn>
          <TableRowColumn>
            <TextField name={trip._id + 'comment'} placeholder="Comment" onChange={(err, value) => {this.clearAlert(); trip.comment = value;}} value={trip.comment}></TextField>
          </TableRowColumn>
          <TableRowColumn>
            <FlatButton onClick={() => this.saveTrip(trip)}>Save <SaveIcon className="material-icon" style={{color: '#00bcd4'}}/> </FlatButton>
            <FlatButton onClick={() => this.deleteTrip(trip)}>Delete <DeleteIcon className="material-icon" style={{color: '#ff4081'}} /> </FlatButton>
          </TableRowColumn>
        </TableRow>)
      }
      trips = <Card>
        <CardHeader title={'Trips'}></CardHeader>
        <div className='alert'>{this.state.editAlert}</div>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Destination</TableHeaderColumn>
              <TableHeaderColumn>Start Date</TableHeaderColumn>
              <TableHeaderColumn>End Date</TableHeaderColumn>
              <TableHeaderColumn>Comment</TableHeaderColumn>
              <TableHeaderColumn>Trip Operations</TableHeaderColumn>
            </TableRow>
          </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {rows}
        </TableBody>
      </Table>
      </Card>

    }

    return (
      <div className="page">
        <div className="container">
          <AppBar title="Travel Planner: Trip Dashboard"
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
                        linkButton={true}
                        onClick={() => this.logout()}>Log out <ExitToAppIcon className="material-icon" /></MenuItem>

                      <MenuItem
                        linkButton={true}
                        onClick={() => this.userpanel()}>User Settings <VerifiedUserIcon className="material-icon" /></MenuItem>
                    </IconMenu>
                  }
          />

          <br />

          <RaisedButton onClick={()=>{this.setState({addTripDialogOpen:true})}}>Add Trip</RaisedButton>

          <br />
          <br />

          <Dialog title={'Add Trip'} open={this.state.addTripDialogOpen}
                  actions={[
                    <RaisedButton style={{margin: 12}} onClick={() => this.setState({addTripDialogOpen:false})}>Cancel</RaisedButton>,
                    <RaisedButton style={{margin: 12}} primary={true} onClick={() => this.addTrip()}
                    >Add Trip</RaisedButton>]}>
            <div className='alert'>{this.state.alert}</div>

              <TextField type="text" ref="destination" name="destination" style={{margin:10}} size="20" placeholder="Destination" onChange={() => {this.clearAlert()}}></TextField>
              <br />
              <DatePicker ref="startDate" name="startDate" style={{margin:10}} autoOk={true} onChange={() => {this.clearAlert()}} defaultDate={(new Date)}></DatePicker>
              <br />
              <DatePicker ref="endDate" name="endDate" style={{margin:10}} autoOk={true} onChange={() => {this.clearAlert()}}  defaultDate={(new Date)}></DatePicker>
              <br />
              <TextField type="text" ref="comment" name="comment" style={{margin:10}} size="20" placeholder="Comment" onChange={() => {this.clearAlert()}}></TextField>
              <br />
          </Dialog>

          {trips}

        </div>
      </div>
    );
  }
}