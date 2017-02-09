module.exports = function authorize(app){

  /**
   * Refuses access to everyone except the "admin" user
   */
  function adminOnly(req, res, next) {
    if (req.user.role === 'admin') {
      // you're an admin, so you may proceed
      next();
    }
    else {
      // you're NOT an admin, so denied
      res.status(401).send('Only admins can access this');
    }
  }

  function managerOrAdminOnly(req, res, next) {
    if (req.user.role === 'admin' || req.user.role === 'manager' ) {
      // you're an admin, so you may proceed
      next();
    }
    else {
      // you're NOT an admin, so denied
      res.status(401).send('Only managers and admins can access this');
    }
  }

  function yourselfOrManagerOnly(req, res, next) {
    var userBeingEdited = req.swagger.params.username;

    if (req.user.username === userBeingEdited || req.user.role === 'admin' || req.user.role === 'manager' ) {
      // You're editing yourself.  Or you're an admin.  Either way, you may proceed.
      next();
    }
    else {
      // Nope.  You can't edit other people.
      res.status(401).send('You can only do this for your own account.');
    }
  }

  function yourselfOnly(req, res, next) {
    var userBeingEdited = req.swagger.params.username;

    if (req.user.username === userBeingEdited || req.user.role === 'admin' ) {
      // You're editing yourself.  Or you're an admin.  Either way, you may proceed.
      next();
    }
    else {
      // Nope.  You can't edit other people.
      res.status(401).send('You can only do this for your own account.');
    }
  }


  // Only admins/managers are allowed to get the full list of users
  app.get('/users', managerOrAdminOnly);

  // Only admins/managers can create new users
  app.post('/users', managerOrAdminOnly);

  // Users/managers can only retrieve their own account
  app.get('/users/{username}', yourselfOrManagerOnly);

  // Users/managers can only edit their own account
  app.post('/users/{username}', yourselfOrManagerOnly);

  // Users/managers can only delete their own account
  app.delete('/users/{username}', yourselfOrManagerOnly);

  // Users/managers can only log themselves out
  app.post('/users/{username}/logout', yourselfOrManagerOnly);


  // Only admins are allowed to get the full list of users
  app.get('/trips', adminOnly);

  // Only admins can create new users
  app.post('/trips', yourselfOnly);

  // Users can only retrieve their own account
  app.get('/trips/{tripId}', yourselfOnly);

  // Users can only edit their own account
  app.post('/trips/{tripId}', yourselfOnly);

  // Users can only delete their own account
  app.delete('/trips/{tripId}', yourselfOnly);

};
