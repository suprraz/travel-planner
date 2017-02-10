// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import TravelPlanner from './components/TravelPlanner';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={TravelPlanner} />
    <Route path="/signup" component={SignUp} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;