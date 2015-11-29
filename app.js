// ================
// Project packages
// ================

var restify = require('restify'),
    Logger = require('bunyan'),
    restifyBunyanLogger = require('restify-bunyan-logger'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

var server = restify.createServer({
  name: 'Chat API',
  version: '1.0.0',
  log: new Logger.createLogger({
    name: "Chat API"
  })
})

// =============
// Configuration
// =============

dotenv.config({ silent: true });
dotenv.load();

var dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGO_URL;
var User = require('./models/user');
var Message = require('./models/message');
var usersController = require('./controllers/usersController')(User);
var sessionsController = require('./controllers/sessionsController')(User);
var messagesController = require('./controllers/messagesController')(Message);
var routesAuthenticator = require('./middlewares/routesAuthenticator');

mongoose.connect(dbURL);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(routesAuthenticator);
server.pre(function (request, response, next) {
  if(process.env.NODE_ENV != 'test'){
    request.log.info({ req: {
      method: request.method,
      url: request.url,
      headers: {
        host: request.headers.host,
        token: request.headers["x-access-token"]
      }
    }}, 'REQUEST');
  }
  next();
});

// ======
// Routes
// ======
server.post('/api/authenticate', sessionsController.authenticate);
server.get('/api/admin/users', usersController.list);
server.post('/api/admin/users', usersController.create);
server.del('/api/admin/users/:id', usersController.remove);
server.get('/api/messages', messagesController.list);
server.post('/api/setup', function(req, res, next){
  User.findOne({
    email: process.env.ADMIN_EMAIL
  }, function(err, user){
    if(!user) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(process.env.ADMIN_PWD, salt, function(err, password) {
          var user = new User({
            email: process.env.ADMIN_EMAIL,
            password: password,
            admin: true
          });
          user.save();
        });
      });
    }
    res.status(201)
    res.send('Admin user created!');
  });
});

server.listen(process.env.PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
