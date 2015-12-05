var bcrypt = require('bcrypt');

var usersController = function(User) {
  var list = function(req, res) {
    User.find({}, function(err, users){
      res.json(users);
    });
  };

  var create = function(req, res) {
    var attributes = req.body;

    User.findOne({
      email: attributes.email
    }, function(err, user){
      if(err) {
        res.status(500);
        res.json({ message: err });
      } else {
        if(!user) {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(attributes.password, salt, function(err, password) {
              var user = new User({
                username: attributes.username,
                email: attributes.email,
                password: password
              });
              user.save(function(err) {
                if(err) {
                  res.status(422);
                  res.send({ message: err.toString() });
                } else {
                  res.status(201);
                  res.send(user);
                }
              });
            });
          });
        } else {
          res.status(500);
          res.json({ message: 'User already exists.' });
        }
      }
    });
  };

  var remove = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        res.status(500);
        res.send({ message: err });
      } else {
        user.remove(function(err) {
          if(err) {
            res.status(500);
            res.send({ message: err });
          } else {
            res.json({ message: "User was removed." });
          }
        });
      }
    });
  };

  var setup = function(req, res) {
    User.findOne({
      email: process.env.ADMIN_EMAIL
    }, function(err, user) {
      if(!user) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(process.env.ADMIN_PWD, salt, function(err, password) {
            var user = new User({
              username: 'admin',
              email: process.env.ADMIN_EMAIL,
              password: password,
              admin: true
            });
            user.save();
          });
        });
      }
      res.status(201);
      res.send('Admin user created!');
    });
  };

  return {
    list: list,
    create: create,
    remove: remove,
    setup: setup
  }
};

module.exports = usersController;
