module.exports = {
  authenticateUser:  function(app) {
    app.use(function (req, res, next) {
      req.user = {};

      if(req.session.user) {
        req.user = req.session.user;
      }

      next();
    });
  }
};