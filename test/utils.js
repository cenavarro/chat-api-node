var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

module.exports = {
  adminToken: jwt.sign({ email: "admin@example.com", admin: true }, process.env.TOKEN_SECRET),
  generatePassword: function(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
