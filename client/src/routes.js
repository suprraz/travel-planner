// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import TravelPlanner from './components/TravelPlanner';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserPanel from './components/UserPanel';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={TravelPlanner} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={Login} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/userpanel" component={UserPanel} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;