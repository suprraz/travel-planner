module.exports = function authorize(app){

  /**
   * Refuses access to everyone except the "admin" user
   */
  function adminOnly(req, res, next) {
    if (req.user.username === 'admin') {
      // you're an admin, so you may proceed
      next();
    }
    else {
      // you're NOT an admin, so denied
      res.status(401).send('Only admins can access this');
    }
  }


  /**
   * Allows users to perform operations on their own account, but not other people's accounts.
   * Except for the Admin user, who is allowed to do anything to any account.
   */
  function yourselfOnly(req, res, next) {
    var userBeingEdited = req.swagger.params.username;

    if (req.user.username === userBeingEdited || req.user.username === 'admin') {
      // You're editing yourself.  Or you're an admin.  Either way, you may proceed.
      next();
    }
    else {
      // Nope.  You can't edit other people.
      res.status(401).send('You can only do this for your own account.');
    }
  }


  // Only admins are allowed to get the full list of users
  app.get('/users', adminOnly);

  // Only admins can create new users
  app.post('/users', adminOnly);

  // Users can only retrieve their own account
  app.get('/users/{username}', yourselfOnly);

  // Users can only edit their own account
  app.post('/users/{username}', yourselfOnly);

  // Users can only delete their own account
  app.delete('/users/{username}', yourselfOnly);

  // Users can only log themselves out
  app.post('/users/{username}/logout', yourselfOnly);
}
