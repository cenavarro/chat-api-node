var jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

var sessionsController = function(User) {
  var authenticate = function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user){
      if(err) {
        res.status(500);
        res.json({ message: err });
      } else {
        if(!user) {
          res.status(500);
          res.json({ message: 'Authentication failed.' });
        } else if(user) {
          bcrypt.compare(req.body.password, user.password, function(err, result){
            if(result) {
              var temporalUser = { _id: user._id, email: user.email, admin: user.admin };
              var token = jwt.sign(temporalUser, process.env.TOKEN_SECRET);

              res.json({
                message: 'Authentication successfully.',
                token: token
              })
            } else {
              res.status(500);
              res.json({ message: 'Authentication failed.' });
            }
          });
        }
      }
    });
  };

  return {
    authenticate: authenticate
  }
};

module.exports = sessionsController;
