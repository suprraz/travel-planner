var User = require('../models/user');

module.exports = {
  authenticateUser:  function(app) {
    app.use(function (req, res, next) {
      req.user = {};
      if(req.session.user) {
        req.user = req.session.user;
        next();
      } else if(process.env.NODE_ENV === 'unit_test') {
        req.user = req.session.user = getMockUser(req, function (user) {
          req.user = req.session.user =  user;

          next();
        });
      } else {
        next();
      }
    });
  }
};

function getMockUser(req, callback) {
  if(req.cookies && req.cookies.username) {
    User.findOne({username: req.cookies.username}, function(err, user){
      if(err){
        callback ({});
      }else if(user){
        callback(user.toJSON());
      } else {
        callback ({});
      }
    })
  } else {
    callback ({});
  }
}