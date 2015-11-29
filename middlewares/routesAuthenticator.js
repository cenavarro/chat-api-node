// Module validates when a route needs to be authenticated
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var token = req.headers['access-token'];
  var nonSecurePaths = ['/api/authenticate', '/api/setup'];

  if(nonSecurePaths.indexOf(req.url) > -1) {
    next();
  } else {
    if(token) {
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, user) {
        if(err) {
          res.json({ success: false, message: 'Failed to authenticate token.', error: err });
        } else if(req.url.indexOf("/api/admin/") === 0) {
          if(user.admin) {
            req.user = user;
            next();
          } else {
            res.status(403)
            res.send({
              success: false,
              message: 'Not authorized.'
            })
          }
        } else {
          req.user = user;
          next();
        }
      })
    } else {
      res.status(403)
      res.send({
        success: false,
        message: 'No token provided.'
      })
    }
  }
};
