var bcrypt = require('bcrypt');

var usersController = function(User) {
  var validAttributes = function(attributes) {
    return attributes.email && attributes.password;
  };

  var list = function(req, res) {
    User.find({}, function(err, users){
      res.json(users);
    });
  };

  var create = function(req, res) {
    var attributes = req.body;

    if(validAttributes(attributes)) {
      User.findOne({
        email: attributes.email
      }, function(err, user){
        if(!user) {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(attributes.password, salt, function(err, password) {
              var user = new User({
                email: attributes.email,
                password: password
              });
              user.save();
              res.status(201)
              res.send(user);
            });
          });
        } else {
          res.status(500);
          res.json({ message: 'User already exists.' });
        }
      });
    }else{
      res.status(500);
      res.json({ message: 'User not valid.' });
    }
  };

  var remove = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        res.status(500);
        res.send(err);
      } else {
        user.remove(function(err) {
          if(err) {
            res.status(500);
            res.send(err);
          } else {
            res.json({ message: "User was removed." });
          }
        });
      }
    });

  };

  return {
    list: list,
    create: create,
    remove: remove
  }
};

module.exports = usersController;
