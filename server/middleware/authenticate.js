module.exports = function authenticate (req, res, next) {
  // Get the session ID from the session cookie
  var sessionId = req.cookies['demo-session-id'];
  req.user = {};

  if (sessionId) {
    // Find the user account for this session ID
    User.findOne({ sessionId: sessionId }, function(err, user) {
      if(user) {
        console.log(user); // { name: 'Sam' }
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
}