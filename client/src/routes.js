// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import Game from './components/Game';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Game} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;