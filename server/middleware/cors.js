var cors = require('cors');

module.exports = {
  setHeaders: function(app) {
    return app.use(cors({credentials: true, origin: true}));

    app.all('*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }
};